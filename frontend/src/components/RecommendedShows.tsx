// frontend/src/components/RecommendedShows.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetBecauseYouWatchedQuery } from '../redux/rtkQuery/personalizeApi';
import { Show } from '../types/Show';
import { Container, ShowsContainer, ShowCard, ThumbnailContainer, Thumbnail } from '../styled/RecommendedShows.styled';
import { getPreferredImage } from '../utils/images';
import ShowModal from './ShowModal';
import { useAuth } from './AuthContext';
import { skipToken } from '@reduxjs/toolkit/query';

type Props = {
  shows: Show[];
  currentShowId?: string;
}

const RecommendedShows: React.FC<Props> = ({ shows, currentShowId }: Props) => {
  const navigate = useNavigate();
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth();
  
  // If we have a current show ID and the user is authenticated, fetch personalized recommendations
  const { 
    data: personalizedShows, 
    isSuccess: hasPersonalizedShows,
    refetch 
  } = useGetBecauseYouWatchedQuery(
    (isAuthenticated && user?.uid && currentShowId) 
      ? { 
          id: currentShowId, 
          isShowId: true, 
          userId: user.uid, 
          limit: 15 // Increased from 10 to 15
        } 
      : skipToken
  );
  
  // Force refetch when currentShowId changes
  useEffect(() => {
    if (currentShowId && isAuthenticated && user?.uid) {
      console.log(`RecommendedShows: Show ID changed to ${currentShowId}, forcing refetch`);
      refetch();
    }
  }, [currentShowId, isAuthenticated, user?.uid, refetch]);
  
  // Use personalized recommendations if available, otherwise use the shows passed in props
  const recommendedShows = hasPersonalizedShows && personalizedShows && personalizedShows.length > 0
    ? personalizedShows.filter(show => show.id !== currentShowId)
    : shows.filter(show => show.id !== currentShowId);

  // Log recommendations for debugging
  useEffect(() => {
    console.log(`RecommendedShows: Current show ID is ${currentShowId}`);
    console.log(`RecommendedShows: Using ${hasPersonalizedShows ? 'personalized' : 'generic'} recommendations`);
    console.log(`RecommendedShows: Got ${recommendedShows.length} recommendations`);
  }, [currentShowId, hasPersonalizedShows, recommendedShows.length]);

  const handleShowClick = (show: Show) => {
    setSelectedShow(show);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedShow(null);
  };

  const handleWatchShow = (showId: string) => {
    handleCloseModal();
    
    setTimeout(() => {
      window.location.href = `/watch/${showId}`;
    }, 100);
  };

  const handleEpisodeSelect = (showId: string, episodeId: string) => {
    handleCloseModal();
    
    setTimeout(() => {
      window.location.href = `/watch/${showId}?episodeId=${episodeId}`;
    }, 100);
  };

  if (recommendedShows.length === 0) {
    return null;
  }

  return (
    <Container>
      <ShowsContainer>
        {recommendedShows.map(show => (
          <ShowCard key={`${currentShowId}-rec-${show.id}`} onClick={() => handleShowClick(show)}>
            <ThumbnailContainer>
              <Thumbnail
                src={getPreferredImage(show.attributes.images)}
                alt={show.attributes.title}
              />
            </ThumbnailContainer>
          </ShowCard>
        ))}
      </ShowsContainer>

      {selectedShow && (
        <ShowModal 
          showData={selectedShow} 
          show={showModal} 
          onHide={handleCloseModal} 
          onWatch={handleWatchShow} 
          onEpisodeSelect={handleEpisodeSelect}
        />
      )}
    </Container>
  );
};

export default RecommendedShows;