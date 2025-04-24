import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Show } from '../types/Show';
import { Container, ShowsContainer, ShowCard, ThumbnailContainer, Thumbnail } from '../styled/RecommendedShows.styled';
import { getPreferredImage } from '../utils/images';
import ShowModal from './ShowModal';

type Props = {
  shows: Show[];
}

const RecommendedShows: React.FC<Props> = ({ shows }: Props) => {
  const navigate = useNavigate();
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

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

  return (
    <Container>
      <ShowsContainer>
        {shows.map(show => (
          <ShowCard key={show.id} onClick={() => handleShowClick(show)}>
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
        <ShowModal showData={selectedShow} show={showModal} onHide={handleCloseModal} onWatch={handleWatchShow} onEpisodeSelect={handleEpisodeSelect}
        />
      )}
    </Container>
  );
};

export default RecommendedShows;