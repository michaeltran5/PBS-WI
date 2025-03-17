import styled from 'styled-components';

export const EpisodeContainer = styled.div`
  background-color: transparent;
  cursor: pointer;
  overflow: hidden;
  height: 160px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  border-radius: 4px;
  position: relative;
`;

export const ThumbnailContainer = styled.div`
  width: 280px;
  height: 160px;
  overflow: hidden;
  border-radius: 4px;
`;

export const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const ContentContainer = styled.div`
  flex: 1;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h5`
  color: white;
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
`;

export const NowPlaying = styled.span`
  margin-left: 10px;
  font-size: 16px;
  color: #ffcf00;
  font-style: italic;
`;

export const EpisodeInfo = styled.div`
  color: #aaaaaa;
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 8px 0;
`;

export const Description = styled.p`
  color: white;
  font-size: 16px;
  margin: 0 0 8px 0;
  max-height: 54px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const Duration = styled.div`
  color: #aaaaaa;
  font-size: 15px;
  margin-top: auto;
`;