import { useGetTopPicksQuery } from '../redux/rtkQuery/personalizeApi';
import { Container, LoadingContainer, LoadingText } from '../styled/MediaPlayer.styled';
import { ErrorText } from '../styled/EpisodeDetails.styled';
import { useAuth } from '../components/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPreferredImage } from "../utils/images";
import DefaultImage from '../assets/default-image.png';
import { Cover, Hover } from "../styled/MediaCard.styled";
import 'react-multi-carousel/lib/styles.css';
import { Container as RowContainer, Title } from "../styled/MediaRow.styled";
import Carousel from "react-multi-carousel";
import styled from "styled-components";

// Specialized card component for top picks
const TopPicksCard = ({ show }) => {
  const navigate = useNavigate();
  
  // Safety check
  if (!show || typeof show !== 'object') {
    return null;
  }
  
  const handleClick = () => {
    console.log('Clicked on top picks item:', show);
    
    // Determine the correct navigation path
    if ('assetId' in show && show.assetId) {
      // For PBS assets, navigate to watch page with assetId as a param
      console.log(`Top picks: Navigating to watch with assetId=${show.assetId}`);
      navigate(`/watch?assetId=${show.assetId}`);
    } else {
      // For regular shows, use the standard navigation
      const id = show.showId || show.id;
      console.log(`Top picks: Navigating to show id=${id}`);
      navigate(`/watch/${id}`);
    }
  };
  
  // Safe access to attributes
  const attributes = show.attributes || {};
  
  // Handle case where images might be undefined
  const imageUrl = attributes.images ? 
    getPreferredImage(attributes.images) : 
    DefaultImage;

  // Handle case where title might be undefined
  const title = attributes.title || "Untitled";
  
  return (
    <Hover onClick={handleClick}>
      <Cover
        src={imageUrl}
        alt={title}
      />
    </Hover>
  );
};

// Custom styled components for TopPicksCarousel
const CarouselContainer = styled.div`
  padding-inline-end: 64px;
`;

const StyledCarousel = styled(Carousel)`
  overflow: visible;
  left: -3px;

  .carouselItem {
    margin-right: 8px;
    width: calc(20% - 16px);

    @media screen and (max-width: 1439px) {
      width: calc(20% - 8px);
      margin-right: 4px;
    }

    @media screen and (max-width: 1023px) {
      width: calc(25% - 8px);
      margin-right: 4px;
    }

    @media screen and (max-width: 766px) {
      width: calc(50% - 8px);
      margin-right: 4px;
    }
  }
`;

export const TopPicksCarousel = () => {
  const { isAuthenticated, user } = useAuth();
  
  // If user is not authenticated, don't show the carousel
  if (!isAuthenticated || !user?.uid) {
    return null;
  }
  
  const { data: topPicksShows, isLoading, error } = useGetTopPicksQuery({ 
    userId: user.uid,
    limit: 25
  });

  // Log the data for debugging
  useEffect(() => {
    if (topPicksShows) {
      console.log(`TopPicksCarousel: Received ${topPicksShows.length} shows`);
      
      // Check if any are PBS assets
      const pbsAssets = topPicksShows.filter(show => 'assetId' in show);
      if (pbsAssets.length > 0) {
        console.log(`TopPicksCarousel: ${pbsAssets.length} shows are PBS assets`);
      }
    }
  }, [topPicksShows]);

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingText>Loading personalized recommendations...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    console.error('Error loading personalized recommendations:', error);
    return (
      <ErrorText>
        Error: {error instanceof Error ? error.message : 'An error occurred loading personalized recommendations'}
      </ErrorText>
    );
  }

  if (!topPicksShows || topPicksShows.length === 0) {
    console.log('No personalized recommendations available');
    return null;
  }

  // Define responsive settings for the carousel
  const responsive = {
    largeDesktop: {
      breakpoint: { max: Number.MAX_SAFE_INTEGER, min: 1440 },
      items: 5.5,
      slidesToSlide: 5.5,
      partialVisibilityGutter: 10
    },
    desktop: {
      breakpoint: { max: 1439, min: 1024 },
      items: 5.5,
      slidesToSlide: 5,
      partialVisibilityGutter: 10
    },
    tablet: {
      breakpoint: { max: 1023, min: 767 },
      items: 4,
      slidesToSlide: 4,
      partialVisibilityGutter: 10
    },
    smallTablet: {
      breakpoint: { max: 766, min: 464 },
      items: 2,
      slidesToSlide: 2,
      partialVisibilityGutter: 10
    },
    mobile: {
      breakpoint: { max: 463, min: 0 },
      items: 2,
      slidesToSlide: 2,
      partialVisibilityGutter: 10
    }
  };

  // Custom carousel with our specialized card component
  return (
    <RowContainer>
      <Title>Top Picks</Title>
      <CarouselContainer>
        <StyledCarousel
          responsive={responsive}
          itemClass="carouselItem"
        >
          {topPicksShows.map((show, index) => (
            <TopPicksCard key={`toppick-${show.id}-${index}`} show={show} />
          ))}
        </StyledCarousel>
      </CarouselContainer>
    </RowContainer>
  );
};