import React, { useState } from 'react';
import { Show } from '../types/Show';
import { useGetShowsByGenreQuery } from '../redux/rtkQuery/customApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { getPreferredImage } from '../utils/images';
import ShowModal from './ShowModal';
import { Container, LoadingText, NoShowsText, ShowsGrid, ShowCard, ImageContainer, ShowImage, ShowTitle
} from '../styled/ModalRecommendedShows.styled';

interface ModalRecommendedShowsProps {
  show: Show;
  onShowSelect?: (show: Show) => void;
}

const ModalRecommendedShows: React.FC<ModalRecommendedShowsProps> = ({ show, onShowSelect }) => {
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const { data: genreShowsResponse, isLoading, error } = useGetShowsByGenreQuery(
    show ? { genreSlug: show.attributes.genre.slug } : skipToken
  );

  const recommendedShows = genreShowsResponse?.filter(
    recommendedShow => recommendedShow.id !== show.id
  ) || [];

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
          <ShowCard key={recommendedShow.id} onClick={() => handleShowClick(recommendedShow)}>
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