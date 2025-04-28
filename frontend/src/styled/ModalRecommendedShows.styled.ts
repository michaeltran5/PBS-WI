import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

export const LoadingText = styled.div`
  color: white;
  text-align: center;
  padding: 20px;
`;

export const NoShowsText = styled.div`
  color: white;
  text-align: center;
  padding: 20px;
`;

export const ShowsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  width: 100%;
`;

export const ShowCard = styled.div`
  cursor: pointer;
  transition: transform 0.3s ease;
  overflow: hidden;
  border-radius: 8px;
  background-color: #151929;
  
  &:hover {
    transform: scale(1.05);
  }
`;

export const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  position: relative;
`;

export const ShowImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ShowTitle = styled.h3`
  font-size: 1rem;
  padding: 10px;
  margin: 0;
  color: white;
  font-weight: normal;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;