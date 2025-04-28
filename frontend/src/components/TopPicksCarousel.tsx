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
import { useGetShowByIdQuery } from '../redux/rtkQuery/pbsWiApi';
import { skipToken } from '@reduxjs/toolkit/query';

// Specific episode ID to exclude
const EXCLUDED_EPISODE_ID = '734d997b-8681-4f1c-9716-a7a7716535fb';

// Specialized card component for top picks
const TopPicksCard = ({ show, index }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);
  
  // Get the real show ID
  const showId = show.attributes?.parent_tree?.attributes?.season?.attributes?.show?.id || show.id;
  
  // Fetch the actual show data to get the featured preview
  const { data: showData } = useGetShowByIdQuery(
    showId ? { id: showId } : skipToken
  );
  
  // Safety check
  if (!show || typeof show !== 'object') {
    return null;
  }
  
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get the featured preview from the show data if available
    const featuredPreview = showData?.attributes?.featured_preview;
    console.log('Featured preview from show data:', featuredPreview);
    
    // For PBS assets with parent_tree, prepare show data for the modal
    if (show.attributes?.parent_tree?.id) {
      // Extract show ID and episode ID
      const episodeId = show.attributes.parent_tree.id;
      const parentShowId = show.attributes.parent_tree?.attributes?.season?.attributes?.show?.id;
      
      // Create a show object that will work with the existing ShowModal component
      const showObj = {
        // Use the show ID if available, otherwise use the item's own ID
        id: parentShowId || show.id,
        attributes: {
          // Use appropriate title based on what's available
          title: show.attributes.parent_tree?.attributes?.season?.attributes?.show?.attributes?.title || show.attributes.title,
          description_long: show.attributes.description_long || show.attributes.description_short,
          images: show.attributes.images,
          genre: show.attributes.genre,
          // IMPORTANT: Only use the featured_preview if it exists
          ...(featuredPreview ? { featured_preview: featuredPreview } : {}),
          // Keep the episode ID for direct playback if needed
          parent_tree: show.attributes.parent_tree
        }
      };
      
      // Always show the modal regardless of content type
      setSelectedShow(showObj);
      setShowModal(true);
    } else {
      // Regular show or non-episode asset, use show data if available
      const showToUse = showData || show;
      
      // Create a show object with the correct featured_preview
      const showObj = {
        ...showToUse,
        attributes: {
          ...showToUse.attributes,
          // Important: Remove any featured_preview property that might not be valid
          // and only set it if we have the proper one from showData
        }
      };
      
      // Only add featured_preview if it exists in the real show data
      if (featuredPreview) {
        showObj.attributes.featured_preview = featuredPreview;
      } else {
        // If there's no featured_preview in showData, delete any existing one
        // to ensure the preview button doesn't show or doesn't do anything
        delete showObj.attributes.featured_preview;
      }
      
      // Always show the modal
      setSelectedShow(showObj);
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

  // Filter and deduplicate shows
  const filteredShows = (() => {
    // First apply the existing filters
    const initialFiltered = topPicksShows?.filter(show => {
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
    
    // Then deduplicate by show ID
    // We'll use a Map to keep track of shows we've seen
    const uniqueShows = new Map();
    
    // For each show, we'll extract a unique identifier
    initialFiltered.forEach(show => {
      // Get the real show ID (either directly or from parent_tree)
      const showId = show.attributes?.parent_tree?.attributes?.season?.attributes?.show?.id || show.id;
      
      // If we haven't seen this show before, add it to our Map
      if (showId && !uniqueShows.has(showId)) {
        uniqueShows.set(showId, show);
      }
    });
    
    // Convert the Map values back to an array
    return Array.from(uniqueShows.values());
  })();

  // Log the filtered data
  useEffect(() => {
    if (topPicksShows) {
      const originalCount = topPicksShows.length;
      const afterExclusionCount = topPicksShows.filter(show => {
        const episodeId = show?.attributes?.parent_tree?.id;
        return episodeId !== EXCLUDED_EPISODE_ID && show && show.attributes;
      }).length;
      const finalCount = filteredShows.length;
      
      console.log(`TopPicksCarousel: Started with ${originalCount} shows`);
      console.log(`After exclusion filtering: ${afterExclusionCount} shows`);
      console.log(`After deduplication: ${finalCount} shows`);
      
      if (afterExclusionCount !== finalCount) {
        console.log(`Removed ${afterExclusionCount - finalCount} duplicate shows`);
      }
      
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