import styled from 'styled-components';

export const VideoContainer = styled.div`
  position: relative;
  overflow: hidden;
  padding-top: 56.25%;
  width: 100%;
  background-color: #000;
`;

export const PlayerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const BackButton = styled.button<{ isVisible: boolean }>`
  position: absolute;
  top: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.3s ease-in-out;
  font-size: 20px;
  font-weight: bold;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

export const ThumbnailContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #171b33;
`;

export const LoadingSpinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: #ffcf00;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const Message = styled.p`
  font-size: 16px;
  color: #ffcf00;
  margin-top: 10px;
`;

export const BackButtonContainer = styled.div`
  margin-top: 20px;
`;

export const ErrorButton = styled.button`
  padding: 10px 20px;
  background-color: #ffcf00;
  color: #000;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;