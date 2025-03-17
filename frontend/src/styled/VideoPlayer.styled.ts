import styled from 'styled-components';

interface PlayerContainerProps {
  fullWidth: boolean;
}

export const PlayerContainer = styled.div<PlayerContainerProps>`
  width: ${props => props.fullWidth ? '94%' : '950px'};
  padding-bottom: ${props => props.fullWidth ? 'calc(94% * 0.5625)' : '0'};
  height: ${props => props.fullWidth ? '0' : '534px'};
  position: relative;
  background-color: #000;
  margin-bottom: 50px;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
`;

export const VideoIframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
`;

interface OverlayProps {
  isVisible: boolean;
}

export const Overlay = styled.div<OverlayProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40%;
  padding: 25px 20px;
  color: white;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.3s ease-in-out;
  pointer-events: none;
  background: linear-gradient(to bottom, rgba(0, 5, 37, 0.8) 0%, rgba(0, 5, 37, 0.6) 40%, rgba(0, 5, 37, 0.3) 70%, rgba(0, 5, 37, 0) 100%);
`;

export const OverlayContent = styled.div`
  max-width: 25%;
`;

export const ShowTitle = styled.h3`
  font-size: 16px;
  margin: 0 0 10px 0;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
`;

export const EpisodeTitle = styled.h2`
  font-size: 24px;
  margin: 0 0 8px 0;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
`;

export const EpisodeInfo = styled.div`
  font-weight: bold;
  color: #ffcf00;
  font-size: 15px;
  margin-bottom: 8px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
`;

export const Description = styled.p`
  font-size: 16px;
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
`;

export const Metadata = styled.div`
  font-size: 14px;
  opacity: 0.8;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
`;

export const MetadataSeparator = styled.span`
  margin: 0 5px;
`;

export const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: white;
`;

export const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #ff5555;
`;