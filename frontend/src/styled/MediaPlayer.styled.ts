import styled from 'styled-components';

export const Container = styled.div`
  background-color: #000525;
  min-height: 100vh;
`;

export const Content = styled.div`
  padding-top: 60px;
`;

export const TabContent = styled.div`
  width: 94%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;
  position: relative;
`;

interface TabPanelProps {
  isActive: boolean;
}

export const TabPanel = styled.div<TabPanelProps>`
  opacity: ${props => props.isActive ? 1 : 0};
  position: ${props => props.isActive ? 'relative' : 'absolute'};
  width: 100%;
  top: 0;
  left: 0;
  transition: opacity 0.3s ease;
  z-index: ${props => props.isActive ? 2 : 1};
  pointer-events: ${props => props.isActive ? 'auto' : 'none'};
  min-height: ${props => props.isActive ? 'auto' : '0'};
  overflow: hidden;
  display: ${props => props.isActive ? 'block' : 'none'};
`;

export const LoadingContainer = styled.div`
  padding-top: calc(60px + 1rem);
  margin-top: 1rem;
`;

export const LoadingText = styled.div`
  color: white;
  text-align: center;
`;

export const RecommendationsContainer = styled.div`
  margin-top: 20px;
`;

export const RecommendationsTitle = styled.h2`
  color: white;
  font-size: 24px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255,255,255,0.2);
`;

export const RecommendationsSubtitle = styled.p`
  color: white;
  margin-bottom: 1rem;
`;

export const RecommendationsLoadingText = styled.div`
  color: white;
  text-align: center;
`;

export const NoRecommendationsText = styled.div`
  color: white;
  text-align: center;
`;