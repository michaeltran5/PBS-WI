import { useState, useRef, useEffect } from 'react';
import { PlayerContainer, VideoIframe, Overlay, OverlayContent, ShowTitle, EpisodeTitle, EpisodeInfo, Description, Metadata,
  MetadataSeparator, LoadingMessage, ErrorMessage} from '../styled/VideoPlayer.styled';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetAssetByEpisodeIdQuery } from '../redux/rtkQuery/pbsWiApi';

type Props = {
  episodeId?: string;
  fullWidth?: boolean;
}
export const VideoPlayer = ({ episodeId, fullWidth }: Props) => {
  const { data: episode, isLoading, error } = useGetAssetByEpisodeIdQuery(episodeId ? { id: episodeId } : skipToken);
  const [isHovering, setIsHovering] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return <LoadingMessage>Loading episode...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>
      Error: {error instanceof Error ? error.message : 'An error occurred'}
    </ErrorMessage>;
  }

  if (!episode) {
    return <LoadingMessage>No content available</LoadingMessage>;
  }

  // extract inframee source from player code and update parameters
  const playerCode = episode.attributes.player_code || '';
  const srcMatch = playerCode.match(/src=['"]([^'"]+)['"]/);
  let iframeSrc = srcMatch ? srcMatch[1] : '';

  if (iframeSrc) {
    if (fullWidth) {
      iframeSrc = iframeSrc.replace('autoplay=false', 'autoplay=false');
    } else {
      iframeSrc = iframeSrc.replace('autoplay=false', 'autoplay=false&maxwidth=950&maxheight=534');
    }
  }
  
  // format dates to mm/dd/yyyy
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  // get episode metadata
  const seasonNumber = episode.attributes.parent_tree?.attributes?.season?.attributes?.ordinal;
  const episodeNumber = episode.attributes.parent_tree?.attributes?.ordinal;
  const premiereDate = formatDate(episode.attributes.premiered_on || null);
  const expirationDate = formatDate(episode.attributes.availabilities?.public?.end || null);
  const description = episode.attributes.description_short || 
                      (episode.attributes.description_long && episode.attributes.description_long.substring(0, 150) + '...');
  
  // format duration
  const minutes = episode.attributes.duration ? Math.floor(episode.attributes.duration / 60) : 0;
  const seconds = episode.attributes.duration ? episode.attributes.duration % 60 : 0;
  const durationText = `${minutes}m ${seconds}s`;
  
  // overlay handling with hover
  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsHovering(true);
  };
  
  const handleMouseLeave = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    
    hideTimeoutRef.current = setTimeout(() => {
      setIsHovering(false);
      hideTimeoutRef.current = null;
    }, 2500);
  };
    
  return (
    <PlayerContainer fullWidth={fullWidth} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <VideoIframe src={iframeSrc} allowFullScreen allow="encrypted-media" title={episode.attributes.title}/>
      
      <Overlay isVisible={isHovering}>
        <OverlayContent>
          {episode.attributes.parent_tree?.attributes?.season?.attributes?.show?.attributes?.title && (
            <ShowTitle>{episode.attributes.parent_tree?.attributes?.season?.attributes?.show?.attributes?.title}</ShowTitle>
          )}
          
          <EpisodeTitle>{episode.attributes.title}</EpisodeTitle>
          
          {(seasonNumber !== undefined || episodeNumber !== undefined) && (
            <EpisodeInfo>
              {seasonNumber !== undefined && episodeNumber !== undefined ? (
                <span>Season {seasonNumber} • Episode {episodeNumber}</span>
              ) : seasonNumber !== undefined ? (
                <span>Season {seasonNumber}</span>
              ) : episodeNumber !== undefined ? (
                <span>Episode {episodeNumber}</span>
              ) : null}
              
              {episode.attributes.duration && (
                <span> | {durationText}</span>
              )}
            </EpisodeInfo>
          )}
          
          <Description>{description}</Description>
          
          <Metadata>
            <span>Aired: {premiereDate}</span>
            <MetadataSeparator>|</MetadataSeparator>
            <span>Expires: {expirationDate}</span>
          </Metadata>
        </OverlayContent>
      </Overlay>
    </PlayerContainer>
  );
};

export default VideoPlayer;