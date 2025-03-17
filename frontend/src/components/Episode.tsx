import React from 'react';
import { Episode as EpisodeType } from '../types/Episode';
import { EpisodeContainer, ThumbnailContainer, Thumbnail,ContentContainer, Title, NowPlaying, EpisodeInfo, Description, 
    Duration} from '../styled/Episode.styled';

interface EpisodeProps {
  episode: EpisodeType;
  onClick: (id: string) => void;
  isActive?: boolean;
}

const Episode: React.FC<EpisodeProps> = ({ episode, onClick, isActive = false }) => {
  // get the best image or use placeholder
  const getEpisodeImage = () => {
    if (!episode.attributes.images || episode.attributes.images.length === 0) {
      return '/api/placeholder/280/160';
    }
    
    const imageObj = episode.attributes.images.find(img => 
      img.profile === 'asset-mezzanine-16x9' || 
      img.profile === 'episode-mezzanine-16x9'
    );
    
    return imageObj ? imageObj.image : '/api/placeholder/280/160';
  };

  const seasonNumber = episode.attributes.parent_tree?.attributes?.season?.attributes?.ordinal;
  const episodeNumber = episode.attributes.parent_tree?.attributes?.ordinal;

  // format duration to hours and minutes
  const formatDuration = (durationInSeconds?: number) => {
    if (!durationInSeconds) return 'N/A';
    
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <EpisodeContainer onClick={() => onClick(episode.id)}>
      {/* thumbnail */}
      <ThumbnailContainer><Thumbnail src={getEpisodeImage()} alt={episode.attributes.title}/></ThumbnailContainer>
      
      {/* episode details */}
      <ContentContainer>
        {/* title */}
        <Title>
          {episode.attributes.title}
          {isActive && <NowPlaying>(Now Playing)</NowPlaying>}
        </Title>
        
        {/* season and episode numbers */}
        {(seasonNumber !== undefined || episodeNumber !== undefined) && (
          <EpisodeInfo>
            {seasonNumber !== undefined && (
              <span>S{seasonNumber}</span>
            )}
            {seasonNumber !== undefined && episodeNumber !== undefined && (
              <span> | </span>
            )}
            {episodeNumber !== undefined && (
              <span>Ep{episodeNumber}</span>
            )}
          </EpisodeInfo>
        )}
        
        {/* description */}
        <Description>{episode.attributes.description_short || "No description available"}</Description>
        
        {/* duration */}
        <Duration> {formatDuration(episode.attributes.duration)}</Duration>
      </ContentContainer>
    </EpisodeContainer>
  );
};

export default Episode;