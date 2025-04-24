import React, { useState, useRef, useEffect } from 'react';
import { useGetAssetByIdQuery } from '../redux/rtkQuery/pbsWiApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { VideoContainer, PlayerWrapper, BackButton, ThumbnailContainer, LoadingSpinner, Message, ErrorButton, LoadingContainer
} from '../styled/PreviewPlayer.styled';

interface PreviewPlayerProps {
  cid: string;
  showData?: any;
  onBack?: () => void;
}

const PreviewPlayer: React.FC<PreviewPlayerProps> = ({ cid, showData, onBack }) => {
  const [isHovering, setIsHovering] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { data: assetData, isLoading, error } = useGetAssetByIdQuery(
    cid ? { id: cid } : skipToken
  );
  
  const playerCode = assetData?.attributes?.player_code || null;

  const getModifiedSrc = () => {
    if (!playerCode) return null;
    
    const srcMatch = playerCode.match(/src=['"]([^'"]+)['"]/);
    
    if (srcMatch && srcMatch[1]) {
      let iframeSrc = srcMatch[1];
      
      if (iframeSrc.startsWith('//')) {
        iframeSrc = 'https:' + iframeSrc;
      } else if (!iframeSrc.startsWith('http')) {
        iframeSrc = 'https://' + iframeSrc;
      }
      
      if (iframeSrc.includes('?')) {
        iframeSrc = iframeSrc.replace('autoplay=false', 'autoplay=true');
        
        if (!iframeSrc.includes('muted=')) {
          iframeSrc += '&muted=true';
        } else {
          iframeSrc = iframeSrc.replace('muted=false', 'muted=true');
        }
        
        if (!iframeSrc.includes('topbar=')) {
          iframeSrc += '&topbar=false';
        } else {
          iframeSrc = iframeSrc.replace('topbar=true', 'topbar=false');
        }
        
        if (!iframeSrc.includes('endscreen=')) {
          iframeSrc += '&endscreen=false';
        } else {
          iframeSrc = iframeSrc.replace('endscreen=true', 'endscreen=false');
        }
      } else {
        iframeSrc += '?autoplay=true&muted=true&topbar=false&endscreen=false';
      }
      
      return iframeSrc;
    }
    
    return null;
  };
  
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);
  
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

  const videoSrc = getModifiedSrc();

  return (
    <VideoContainer onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {!isLoading && !error && videoSrc && (
        <PlayerWrapper>
          <iframe src={videoSrc} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0}}
            allowFullScreen allow="autoplay; encrypted-media" title="PBS Video Player"/>
          
          {onBack && (
            <BackButton isVisible={isHovering} onClick={onBack}>
              &lt;
            </BackButton>
          )}
        </PlayerWrapper>
      )}
      
      {isLoading && (
        <ThumbnailContainer>
          <LoadingContainer>
            <LoadingSpinner />
            <Message>Loading preview...</Message>
          </LoadingContainer>
        </ThumbnailContainer>
      )}
      
      {error && (
        <ThumbnailContainer>
          <LoadingContainer>
            <Message>Error loading preview</Message>
            {onBack && (
              <ErrorButton onClick={onBack}>
                Go Back
              </ErrorButton>
            )}
          </LoadingContainer>
        </ThumbnailContainer>
      )}
    </VideoContainer>
  );
};

export default PreviewPlayer;