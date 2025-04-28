import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from 'react-bootstrap';
import { StyledModal, MediaContainer, FeaturedImage, ImageOverlay, OverlayButton, CloseButton, InfoSection, ShowTitle,
  ShowDescription, TabContentContainer, TabNavContainer, WatchButton, ButtonContainer, RecommendationsPlaceholder, 
  additionalStyles
} from '../styled/ShowModal.styled';
import { Show } from "../types/Show";
import ModalTabNavigation from './ModalTabNavigation';
import ModalEpisodesList from './ModalEpisodesList';
import ModalRecommendedShows from './ModalRecommendedShows';
import PreviewPlayer from './PreviewPlayer';
import PreviewButton from './PreviewButton';
import { useGetShowSeasonsQuery } from '../redux/rtkQuery/pbsWiApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { useNavigate } from 'react-router-dom';
import { getPreferredImage } from "../utils/images";

interface ShowModalProps {
  show: boolean;
  onHide: () => void;
  showData: Show;
  onWatch?: (showId: string) => void;
  onEpisodeSelect?: (showId: string, episodeId: string) => void;
  onShowChange?: (show: Show) => void;
}

const ShowModal: React.FC<ShowModalProps> = ({ show, onHide, showData, onWatch, onEpisodeSelect, onShowChange }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('episodes');
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [currentShowData, setCurrentShowData] = useState<Show>(showData);
  
  useEffect(() => {
    setCurrentShowData(showData);
    setShowPreview(false);
    setActiveTab('episodes');
  }, [showData]);
  
  const handleShowChange = useCallback((newShow: Show) => {
    if (onShowChange) {
      onShowChange(newShow);
    } else {
      setCurrentShowData(newShow);
      setShowPreview(false);
      setActiveTab('episodes');
    }
  }, [onShowChange]);
  
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = additionalStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  useEffect(() => {
    if (show) {
      setShowPreview(false);
    }
  }, [show]);
  
  const {
    data: seasonsResponse
  } = useGetShowSeasonsQuery(
    currentShowData?.id && show ? { id: currentShowData.id, params: { page: 1, sort: 'ordinal' } } : skipToken
  );

  const seasons = seasonsResponse?.items ?? [];
  const seasonsCount = seasonsResponse?.pagination?.count ?? 0;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setShowPreview(false);
  };
  
  const handleTogglePreview = () => {
    // Only toggle preview if there's a featured_preview available
    if (currentShowData.attributes?.featured_preview) {
      setShowPreview(prev => !prev);
    } else {
      console.log('No preview available for this show');
    }
  };
  
  const handleWatchShow = useCallback(() => {
    if (onWatch) {
      onWatch(currentShowData.id);
    } else {
      onHide();
      
      setTimeout(() => {
        window.location.href = `/watch/${currentShowData.id}`;
      }, 100);
    }
  }, [onHide, onWatch, currentShowData.id]);

  if (!show) {
    return null;
  }

  return (
    <StyledModal show={show} onHide={onHide} centered={activeTab !== 'episodes'} backdrop="static" 
    className={`show-modal ${activeTab === 'episodes' ? 'episodes-active' : ''}`} backdropClassName="backdrop-blur"
      size="lg"dialogClassName={activeTab === 'episodes' ? 'modal-90w' : ''}>
      <Modal.Body>
        <MediaContainer>
          {showPreview && currentShowData?.attributes?.featured_preview ? (
            <PreviewPlayer 
              cid={currentShowData.attributes.featured_preview} 
              showData={currentShowData}
              onBack={handleTogglePreview}
            />
          ) : (
            <FeaturedImage>
              <img src={getPreferredImage(currentShowData.attributes.images)} alt={currentShowData.attributes.title} />
              <CloseButton onClick={onHide} aria-label="Close" />
              
              <ImageOverlay>
                <OverlayButton onClick={handleTogglePreview}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                  </svg>
                  Preview
                </OverlayButton>
              </ImageOverlay>
            </FeaturedImage>
          )}
        </MediaContainer>
        
        <InfoSection>
          <ShowTitle>{currentShowData.attributes.title}</ShowTitle>
          <ShowDescription>{currentShowData.attributes.description_long}</ShowDescription>
          
          <WatchButton onClick={handleWatchShow}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
            </svg>
            Watch Now
          </WatchButton>
        </InfoSection>
        
        <div>
          <TabNavContainer>
            <ModalTabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
          </TabNavContainer>
          
          <TabContentContainer>
            {activeTab === 'episodes' && (
              <div style={{ padding: '0 20px' }}>
                <ModalEpisodesList showId={currentShowData.id} onHide={onHide} onEpisodeSelect={onEpisodeSelect ? 
                    (episodeId) => onEpisodeSelect(currentShowData.id, episodeId) : undefined }
                />
              </div>
            )}
            
            {activeTab === 'recommended' && (
              <div style={{ padding: '0 20px' }}>
                <ModalRecommendedShows show={currentShowData} onShowSelect={handleShowChange}
                />
              </div>
            )}
          </TabContentContainer>
        </div>
      </Modal.Body>
    </StyledModal>
  );
};

export default ShowModal;