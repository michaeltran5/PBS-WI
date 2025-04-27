import { useGetTopPicksQuery } from '../redux/rtkQuery/personalizeApi';
import { Container, LoadingContainer, LoadingText } from '../styled/MediaPlayer.styled';
import { ErrorText } from '../styled/EpisodeDetails.styled';
import { useAuth } from '../components/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPreferredImage } from "../utils/images";
import ShowModal from "../components/ShowModal";
import DefaultImage from '../assets/default-image.png';
import { Cover, Hover } from "../styled/MediaCard.styled";
import 'react-multi-carousel/lib/styles.css';
import { Container as RowContainer, Title } from "../styled/MediaRow.styled";
import Carousel from "react-multi-carousel";
import styled from "styled-components";

// Specific episode ID to exclude
const EXCLUDED_EPISODE_ID = '734d997b-8681-4f1c-9716-a7a7716535fb';

// Specialized card component for top picks
const TopPicksCard = ({ show, index }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);
  
  // Safety check
  if (!show || typeof show !== 'object') {
    return null;
  }
  
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Clicked on top picks item:', show);
    
    // For PBS assets with parent_tree, prepare show data for the modal
    if (show.attributes?.parent_tree?.id) {
      // Extract show ID and episode ID
      const episodeId = show.attributes.parent_tree.id;
      const showId = show.attributes.parent_tree?.attributes?.season?.attributes?.show?.id;
      
      if (showId) {
        // Get the parent show name if available
        const showTitle = show.attributes.parent_tree?.attributes?.season?.attributes?.show?.attributes?.title || show.attributes.title;
        
        // Create a show object that will work with the existing ShowModal component
        const showObj = {
          id: showId,
          attributes: {
            title: showTitle,
            description_long: show.attributes.description_long || show.attributes.description_short,
            images: show.attributes.images,
            genre: show.attributes.genre
          }
        };
        
        // Set as selected show for the modal
        setSelectedShow(showObj);
        setShowModal(true);
      } else {
        // If we have an episode ID but no show ID, just use direct navigation
        navigate(`/watch?episodeId=${episodeId}`);
      }
    } else {
      // Regular show or non-episode asset, show modal with current show
      setSelectedShow(show);
      setShowModal(true);
    }
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedShow(null);
  };
  
  const handleWatchShow = (showId) => {
    handleCloseModal();
    
    // If this is from a PBS asset with parent_tree, include episode ID
    const episodeId = show.attributes?.parent_tree?.id;
    const queryParam = episodeId ? `?episodeId=${episodeId}` : '';
    
    // Delay navigation to avoid issues during modal closing
    setTimeout(() => {
      navigate(`/watch/${showId}${queryParam}`);
    }, 100);
  };
  
  const handleEpisodeSelect = (showId, episodeId) => {
    handleCloseModal();
    
    // Delay navigation to avoid issues during modal closing
    setTimeout(() => {
      navigate(`/watch/${showId}?episodeId=${episodeId}`);
    }, 100);
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
    <>
      <Hover onClick={handleClick}>
        <Cover
          src={imageUrl}
          alt={title}
        />
      </Hover>
      
      {showModal && selectedShow && (
        <ShowModal
          showData={selectedShow}
          show={showModal}
          onHide={handleCloseModal}
          onWatch={handleWatchShow}
          onEpisodeSelect={handleEpisodeSelect}
        />
      )}
    </>
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

  // Filter out shows with the excluded episode ID in their parent_tree
  const filteredShows = topPicksShows?.filter(show => {
    // Skip shows with the excluded episode ID in parent_tree
    const episodeId = show?.attributes?.parent_tree?.id;
    if (episodeId === EXCLUDED_EPISODE_ID) {
      return false;
    }
    
    // Also filter out any shows without required data
    if (!show || !show.attributes) {
      return false;
    }
    
    return true;
  }) || [];

  // Log the filtered data
  useEffect(() => {
    if (topPicksShows) {
      const originalCount = topPicksShows.length;
      const filteredCount = filteredShows.length;
      
      console.log(`TopPicksCarousel: Filtered ${originalCount} shows down to ${filteredCount} shows`);
      console.log(`Excluded episode ID: ${EXCLUDED_EPISODE_ID}`);
      
      // Check for the problematic episode
      const foundExcluded = topPicksShows.some(show => 
        show?.attributes?.parent_tree?.id === EXCLUDED_EPISODE_ID
      );
      
      if (foundExcluded) {
        console.log(`Found and removed show with episode ID ${EXCLUDED_EPISODE_ID} in parent_tree`);
      }
    }
  }, [topPicksShows, filteredShows]);

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

  if (!filteredShows || filteredShows.length === 0) {
    console.log('No personalized recommendations available after filtering');
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
          {filteredShows.map((show, index) => (
            <TopPicksCard key={`toppick-${show.id}-${index}`} show={show} index={index} />
          ))}
        </StyledCarousel>
      </CarouselContainer>
    </RowContainer>
  );
};