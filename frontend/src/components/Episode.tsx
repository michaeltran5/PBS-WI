import { Episode as EpisodeType } from '../types/Episode';
import { EpisodeContainer, ThumbnailContainer, Thumbnail,ContentContainer, Title, NowPlaying, EpisodeInfo, Description, 
    Duration} from '../styled/Episode.styled';
import { getPreferredImage } from '../utils/images';

type Props = {
  episode: EpisodeType;
  selectedSeason: number;
  onClick: (id: string) => void;
  isActive?: boolean;
}

const Episode = ({ episode, selectedSeason, onClick, isActive = false }: Props) => {
  const episodeNumber = episode.attributes.ordinal;
  const seasonNumber = selectedSeason;
  
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
      <ThumbnailContainer><Thumbnail src={getPreferredImage(episode.attributes.full_length_asset?.attributes.images)} alt={episode.attributes.title}/></ThumbnailContainer>
      
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
        <Duration> {formatDuration(episode.attributes.full_length_asset?.attributes.duration)}</Duration>
      </ContentContainer>
    </EpisodeContainer>
  );
};

export default Episode;