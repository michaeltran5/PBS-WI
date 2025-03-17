import React from 'react';
import { Link } from 'react-router-dom';
import { Show } from '../types/Show';
import { Container, ShowsContainer, ShowCard, ThumbnailContainer, Thumbnail, Title, Description
} from '../styled/RecommendedShows.styled';

interface RecommendedShowsProps {
  shows: Array<Show>;
}

const RecommendedShows: React.FC<RecommendedShowsProps> = ({ shows }) => {
  // get show thumbnail or fallback to placeholder
  const getShowImage = (show: Show) => {
    if (!show.attributes.images || show.attributes.images.length === 0) {
      return '/api/placeholder/210/118'; // 16:9 aspect ratio
    }
    
    return show.attributes.images[0].image;
  };

  return (
    <Container>
      <ShowsContainer>
        {shows.map(show => (
          <Link key={show.id} to={`/watch/${show.id}`} style={{ textDecoration: 'none' }}>
            <ShowCard>
              {/* show thumbnail */}
              <ThumbnailContainer>
                <Thumbnail src={getShowImage(show)} alt={show.attributes.title}/>
              </ThumbnailContainer>
              
              {/* show title */}
              <Title>{show.attributes.title}</Title>
              
              {/* show description */}
              <Description>{show.attributes.description_short}</Description>
            </ShowCard>
          </Link>
        ))}
      </ShowsContainer>
    </Container>
  );
};

export default RecommendedShows;