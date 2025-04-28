// frontend/src/components/ModalRecommendedShows.tsx
import React, { useState, useEffect } from 'react';
import { Show } from '../types/Show';
import { useGetShowsByGenreQuery } from '../redux/rtkQuery/customApi';
import { useGetBecauseYouWatchedQuery } from '../redux/rtkQuery/personalizeApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { getPreferredImage } from '../utils/images';
import ShowModal from './ShowModal';
import { Container, LoadingText, NoShowsText, ShowsGrid, ShowCard, ImageContainer, ShowImage
} from '../styled/ModalRecommendedShows.styled';
import { useAuth } from './AuthContext';

interface ModalRecommendedShowsProps {
  show: Show;
  onShowSelect?: (show: Show) => void;
}

const ModalRecommendedShows: React.FC<ModalRecommendedShowsProps> = ({ show, onShowSelect }) => {
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth();
  
  // First try to get personalized "because you watched" recommendations if the user is authenticated
  const { 
    data: becauseYouWatchedShows, 
    isLoading: isBecauseYouWatchedLoading, 
    error: becauseYouWatchedError,
    refetch 
  } = useGetBecauseYouWatchedQuery(
    (isAuthenticated && user?.uid && show?.id) 
      ? { 
          id: show.id, 
          isShowId: true, 
          userId: user.uid, 
          limit: 15
        } 
      : skipToken
  );
  
  // Force refetch when show changes
  useEffect(() => {
    if (show?.id && isAuthenticated && user?.uid) {
      console.log(`ModalRecommendedShows: Show changed to ${show.id}, forcing refetch`);
      refetch();
    }
  }, [show?.id, isAuthenticated, user?.uid, refetch]);
  
  // Fallback to genre-based recommendations if personalized recommendations fail or user is not authenticated
  const { data: genreShowsResponse, isLoading: isGenreLoading, error: genreError } = useGetShowsByGenreQuery(
    (!becauseYouWatchedShows || becauseYouWatchedShows.length === 0) && show?.attributes?.genre?.slug 
      ? { genreSlug: show.attributes.genre.slug } 
      : skipToken
  );

  // Use personalized recommendations if available, otherwise use genre-based recommendations
  const recommendedShows = becauseYouWatchedShows && becauseYouWatchedShows.length > 0
    ? becauseYouWatchedShows.filter(recommendedShow => recommendedShow.id !== show.id)
    : genreShowsResponse?.filter(recommendedShow => recommendedShow.id !== show.id) || [];
  
  // Loading state
  const isLoading = isBecauseYouWatchedLoading || isGenreLoading;
  
  // Error state
  const error = becauseYouWatchedError && genreError;

  const handleShowClick = (selectedShow: Show) => {
    if (onShowSelect) {
      onShowSelect(selectedShow);
    } else {
      setSelectedShow(selectedShow);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedShow(null);
  };

  if (isLoading) {
    return <LoadingText>Loading recommendations...</LoadingText>;
  }

  if (error) {
    return <NoShowsText>Error loading recommendations</NoShowsText>;
  }

  if (recommendedShows.length === 0) {
    return <NoShowsText>No similar shows found</NoShowsText>;
  }

  return (
    <Container>
      <ShowsGrid>
        {recommendedShows.map(recommendedShow => (
          <ShowCard 
            key={`modal-${show.id}-rec-${recommendedShow.id}`} 
            onClick={() => handleShowClick(recommendedShow)}
          >
            <ImageContainer>
              <ShowImage 
                src={getPreferredImage(recommendedShow.attributes.images)} 
                alt={recommendedShow.attributes.title}
              />
            </ImageContainer>
          </ShowCard>
        ))}
      </ShowsGrid>

      {selectedShow && !onShowSelect && (
        <ShowModal
          showData={selectedShow}
          show={showModal}
          onHide={handleCloseModal}
        />
      )}
    </Container>
  );
};

export default ModalRecommendedShows;