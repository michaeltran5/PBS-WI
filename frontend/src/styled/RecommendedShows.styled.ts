import styled from 'styled-components';

export const Container = styled.div`
`;

export const ShowsContainer = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 20px;
  scrollbar-width: thin;
  scrollbar-color: #555 #222;
`;

export const ShowLink = styled.a`
  text-decoration: none;
`;

export const ShowCard = styled.div`
  width: 210px;
  cursor: pointer;
  transition: transform 0.2s;
`;

export const ThumbnailContainer = styled.div`
  width: 210px;
  height: 118px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`;

export const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Title = styled.h4`
  color: white;
  font-size: 16px;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Description = styled.p`
  color: #aaa;
  font-size: 14px;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
`;