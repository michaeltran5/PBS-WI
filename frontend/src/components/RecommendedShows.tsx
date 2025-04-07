import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Show } from '../types/Show';
import { Container, ShowsContainer, ShowCard, ThumbnailContainer, Thumbnail, Title, Description
} from '../styled/RecommendedShows.styled';

interface RecommendedShowsProps {
  shows: Array<Show>;
}

const RecommendedShows: React.FC<RecommendedShowsProps> = ({ shows }) => {
  const navigate = useNavigate();

  const getShowImage = (show: Show) => {
    if (!show.attributes.images || show.attributes.images.length === 0) {
      return '/api/placeholder/210/118';
    }
    
    return show.attributes.images[0].image;
  };

  const handleClick = (showId: string) => {
    navigate(`/watch/${showId}`);
    window.location.reload();
  };

  return (
    <Container>
      <ShowsContainer>
        {shows.map(show => (
          <ShowCard key={show.id} onClick={() => handleClick(show.id)}>
            <ThumbnailContainer>
              <Thumbnail src={getShowImage(show)} alt={show.attributes.title}/>
            </ThumbnailContainer>
            
            <Title>{show.attributes.title}</Title>
            
            <Description>{show.attributes.description_short}</Description>
          </ShowCard>
        ))}
      </ShowsContainer>
    </Container>
  );
};

export default RecommendedShows;