import styled from 'styled-components';
import { Modal } from 'react-bootstrap';

export const StyledModal = styled(Modal)`
  &.modal {
    padding-right: 0 !important;
  }
  
  .modal-dialog {
    max-width: 900px;
    margin: 2vh auto;
    transform: none !important;
  }
  
  .modal-content {
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    background-color: #171b33;
    color: white;
    border: none;
    overflow: hidden;
  }
  
  .modal-body {
    padding: 0;
  }
  
  &.episodes-active .modal-dialog {
    height: auto;
    max-height: none;
    margin-bottom: 2vh;
  }
  
  &.episodes-active .modal-content {
    height: auto;
    max-height: none;
  }
  
  &.episodes-active .modal-body {
    height: auto;
    max-height: none;
    padding-bottom: 30px;
  }
  
  &.show-modal {
    .modal-dialog {
      max-width: 90%;
      
      @media (min-width: 992px) {
        max-width: 900px;
      }
    }
  }
`;

export const MediaContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
  position: relative;
`;

export const FeaturedImage = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: auto;
    object-fit: cover;
    display: block;
  }
`;

export const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1%;
  background: linear-gradient(to top, #171b33 0%, rgba(23, 27, 51, 0.8) 50%, rgba(23, 27, 51, 0.4) 75%, rgba(23, 27, 51, 0) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 20px;
`;

export const OverlayButton = styled.button`
  background-color: transparent;
  color: white;
  border: 2px solid white;
  padding: 8px 20px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;
  width: fit-content;
  transition: all 0.2s ease;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: none;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 15px;
    height: 2px;
    background-color: white;
  }
  
  &::before {
    transform: rotate(45deg);
  }
  
  &::after {
    transform: rotate(-45deg);
  }
`;

export const InfoSection = styled.div`
  margin-top: -15px;
  padding: 0 20px 5px;
`;

export const ShowTitle = styled.h3`
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin-top: 0;
  margin-bottom: 12px;
`;

export const ShowDescription = styled.p`
  color: #e6e6e6;
  margin-bottom: 16px;
  line-height: 1.5;
  font-size: 1rem;
`;

export const TabContentContainer = styled.div`
  margin-top: 20px;
`;

export const TabNavContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 20px;
`;

export const WatchButton = styled.button`
  background-color: #2639c3;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;
  width: fit-content;
  transition: all 0.2s ease;
  margin: 10px 0 5px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: #3145d6;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

export const RecommendationsPlaceholder = styled.div`
  padding: 20px;
  background-color: #1a203c;
  border-radius: 8px;
  text-align: center;
  color: #b0b0b0;
  font-size: 16px;
  margin-bottom: 20px;
`;

export const additionalStyles = `
  body.modal-open {
    overflow: hidden;
    padding-right: 0 !important;
  }
  
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
`;