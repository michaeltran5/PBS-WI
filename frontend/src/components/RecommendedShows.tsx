import { useNavigate } from 'react-router-dom';
import { Show } from '../types/Show';
import {
  Container, ShowsContainer, ShowCard, ThumbnailContainer, Thumbnail, Title, Description
} from '../styled/RecommendedShows.styled';
import { getPreferredImage } from '../utils/images';

type Props = {
  shows: Show[];
}
const RecommendedShows = ({ shows }: Props) => {
  const navigate = useNavigate();

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
              <Thumbnail
                src={getPreferredImage(show.attributes.images)}
                alt={show.attributes.title}
              />
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