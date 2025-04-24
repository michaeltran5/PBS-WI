// Update frontend/src/components/VideoPlayer.tsx

import { useState, useRef, useEffect } from 'react';
import { PlayerContainer, VideoIframe, Overlay, OverlayContent, ShowTitle, EpisodeTitle, EpisodeInfo, Description, Metadata,
  MetadataSeparator, LoadingMessage, ErrorMessage} from '../styled/VideoPlayer.styled';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetAssetByEpisodeIdQuery, useGetAssetByIdQuery } from '../redux/rtkQuery/pbsWiApi';
import { useGetPBSAssetByIdQuery } from '../redux/rtkQuery/customApi';

type Props = {
  episodeId?: string;
  assetId?: string; // New prop for direct asset ID
  fullWidth?: boolean;
}

export const VideoPlayer = ({ episodeId, assetId, fullWidth }: Props) => {
  console.log(`VideoPlayer rendered with episodeId=${episodeId}, assetId=${assetId}`);
  
  // Fetch episode asset if episodeId is provided
  const { 
    data: episodeAsset, 
    isLoading: isEpisodeLoading, 
    error: episodeError 
  } = useGetAssetByEpisodeIdQuery(episodeId ? { id: episodeId } : skipToken);
  
  // Fetch asset if assetId is provided - try both endpoints
  const { 
    data: pbsApiAsset, 
    isLoading: isPbsApiLoading, 
    error: pbsApiError 
  } = useGetAssetByIdQuery(assetId || skipToken);
  
  const { 
    data: customAsset, 
    isLoading: isCustomLoading, 
    error: customError 
  } = useGetPBSAssetByIdQuery(assetId || skipToken);
  
  // Use whichever asset is available first
  const directAsset = pbsApiAsset || customAsset;
  
  // Final asset = episode asset or direct asset
  const asset = episodeAsset || directAsset;
  const isLoading = isEpisodeLoading || isPbsApiLoading || isCustomLoading;
  const error = episodeError || pbsApiError || customError;
  
  // Log which asset was used
  useEffect(() => {
    if (asset) {
      if (asset === episodeAsset) {
        console.log(`VideoPlayer using episode asset: ${asset.id}`);
      } else if (asset === pbsApiAsset) {
        console.log(`VideoPlayer using PBS API asset: ${asset.id}`);
      } else if (asset === customAsset) {
        console.log(`VideoPlayer using custom endpoint asset: ${asset.id}`);
      }
    }
  }, [asset, episodeAsset, pbsApiAsset, customAsset]);
  
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
    console.error('VideoPlayer error:', error);
    return <ErrorMessage>
      Error: {error instanceof Error ? error.message : 'An error occurred'}
    </ErrorMessage>;
  }

  if (!asset) {
    console.warn('VideoPlayer: No asset available');
    return <LoadingMessage>No content available</LoadingMessage>;
  }

  // Log the asset to check its structure
  console.log('VideoPlayer asset:', {
    id: asset.id,
    title: asset.attributes?.title,
    hasPlayerCode: Boolean(asset.attributes?.player_code)
  });

  // extract iframe source from player code and update parameters
  const playerCode = asset.attributes.player_code || '';
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
  const seasonNumber = asset.attributes.parent_tree?.attributes?.season?.attributes?.ordinal;
  const episodeNumber = asset.attributes.parent_tree?.attributes?.ordinal;
  const premiereDate = formatDate(asset.attributes.premiered_on || null);
  const expirationDate = formatDate(asset.attributes.availabilities?.public?.end || null);
  const description = asset.attributes.description_short || 
                      (asset.attributes.description_long && asset.attributes.description_long.substring(0, 150) + '...');
  
  // format duration
  const minutes = asset.attributes.duration ? Math.floor(asset.attributes.duration / 60) : 0;
  const seconds = asset.attributes.duration ? asset.attributes.duration % 60 : 0;
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
      <VideoIframe src={iframeSrc} allowFullScreen allow="encrypted-media" title={asset.attributes.title}/>
      
      <Overlay isVisible={isHovering}>
        <OverlayContent>
          {asset.attributes.parent_tree?.attributes?.season?.attributes?.show?.attributes?.title && (
            <ShowTitle>{asset.attributes.parent_tree?.attributes?.season?.attributes?.show?.attributes?.title}</ShowTitle>
          )}
          
          <EpisodeTitle>{asset.attributes.title}</EpisodeTitle>
          
          {(seasonNumber !== undefined || episodeNumber !== undefined) && (
            <EpisodeInfo>
              {seasonNumber !== undefined && episodeNumber !== undefined ? (
                <span>Season {seasonNumber} • Episode {episodeNumber}</span>
              ) : seasonNumber !== undefined ? (
                <span>Season {seasonNumber}</span>
              ) : episodeNumber !== undefined ? (
                <span>Episode {episodeNumber}</span>
              ) : null}
              
              {asset.attributes.duration && (
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