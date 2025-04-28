import { Episode as EpisodeType } from '../types/Episode';
import { EpisodeContainer, ThumbnailContainer, Thumbnail, ContentContainer, Title, NowPlaying, EpisodeInfo, 
  Description, Duration, PassportOverlay, PassportImage} from '../styled/Episode.styled';
import { getPreferredImage } from '../utils/images';
import { useGetAssetByEpisodeIdQuery } from '../redux/rtkQuery/pbsWiApi';
import styled from 'styled-components';
import { isAfter, isBefore, parseISO } from 'date-fns';
import passportIcon from '../assets/passport.png';

type Props = {
  episode: EpisodeType;
  selectedSeason: number;
  onClick: (id: string) => void;
  isActive?: boolean;
}

const Episode = ({ episode, selectedSeason, onClick, isActive = false }: Props) => {
  const episodeNumber = episode.attributes.ordinal;
  const seasonNumber = selectedSeason;
  
  const { data: asset } = useGetAssetByEpisodeIdQuery({ id: episode.id });
  
  //pbs passport checking
  const shouldShowPassportOverlay = () => {
    if (!asset?.attributes?.availabilities) return false;
    
    const now = new Date();
    const { public: publicAvail, station_members: stationMembersAvail } = 
      asset.attributes.availabilities;
    
    const isPublicAvailable = isDateRangeActive(publicAvail.start, publicAvail.end, now);
    
    if (isPublicAvailable) {
      return false;
    }
    
    const isStationMembersAvailable = isDateRangeActive(stationMembersAvail.start, stationMembersAvail.end, now);
    
    return isStationMembersAvailable;
  };
  
  const isDateRangeActive = (startDate: string | null, endDate: string | null, currentDate: Date) => {
    if (startDate === null && endDate === null) {
      return true;
    }
    
    if (startDate !== null) {
      const parsedStartDate = parseISO(startDate);
      if (isBefore(currentDate, parsedStartDate)) {
        return false;
      }
    }
    
    if (endDate !== null) {
      const parsedEndDate = parseISO(endDate);
      if (isAfter(currentDate, parsedEndDate)) {
        return false;
      }
    }
    
    return true;
  };
  
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
      <ThumbnailContainer>
        <Thumbnail 
          src={getPreferredImage(episode.attributes.full_length_asset?.attributes.images)} 
          alt={episode.attributes.title}
        />
        {shouldShowPassportOverlay() && (
          <PassportOverlay>
            <PassportImage src={passportIcon} alt="Passport required" />
          </PassportOverlay>
        )}
      </ThumbnailContainer>
      
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
        <Duration>{formatDuration(episode.attributes.full_length_asset?.attributes.duration)}</Duration>
      </ContentContainer>
    </EpisodeContainer>
  );
};

export default Episode;