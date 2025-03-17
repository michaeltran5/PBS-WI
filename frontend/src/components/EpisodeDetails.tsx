import React from 'react';
import { useGetAssetByIdQuery } from '../redux/rtkQuery/pbsWiApi';
import {
 Container, ShowTitle, EpisodeTitle, EpisodeInfo, Description, Metadata, MetadataSeparator, LoadingText, ErrorText
} from '../styled/EpisodeDetails.styled';

interface EpisodeDetailsProps {
  episodeId?: string;
}

export const EpisodeDetails: React.FC<EpisodeDetailsProps> = ({ 
  episodeId = 'c445e87d-40fd-43f1-9ac2-36725d4fea37'
}) => {
  const { data, isLoading, error } = useGetAssetByIdQuery(episodeId);
  
  const episode = data?.data;

  if (isLoading) {
    return <LoadingText>Loading episode details...</LoadingText>;
  }

  if (error) {
    return <ErrorText>
      Error: {error instanceof Error ? error.message : 'An error occurred loading episode details'}
    </ErrorText>;
  }

  if (!episode) {
    return <LoadingText>No episode details available</LoadingText>;
  }

  // format dates to mm/dd/yyyy
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  // get episode metadata
  const seasonNumber = episode.attributes.parent_tree?.attributes?.season?.attributes?.ordinal;
  const episodeNumber = episode.attributes.parent_tree?.attributes?.ordinal;
  const premiereDate = formatDate(episode.attributes.premiered_on || null);
  const expirationDate = formatDate(episode.attributes.availabilities?.public?.end || null);
  const description = episode.attributes.description_long || episode.attributes.description_short;
  const showTitle = episode.attributes.parent_tree?.attributes?.season?.attributes?.show?.attributes?.title;
  
  // format duration to minutes and seconds
  const minutes = episode.attributes.duration ? Math.floor(episode.attributes.duration / 60) : 0;
  const seconds = episode.attributes.duration ? episode.attributes.duration % 60 : 0;
  const durationText = `${minutes}m ${seconds}s`;
    
  return (
    <Container>
      {/* show title */}
      {showTitle && <ShowTitle>{showTitle}</ShowTitle>}
      
      {/* episode title */}
      <EpisodeTitle>{episode.attributes.title}</EpisodeTitle>
      
      {/* season, episode, duration */}
      <EpisodeInfo>
        {seasonNumber !== undefined && episodeNumber !== undefined && (
          <span>Season {seasonNumber} • Episode {episodeNumber}</span>
        )}
        {episode.attributes.duration && (
          <span>
            {seasonNumber !== undefined && episodeNumber !== undefined && ' | '}
            {durationText}
          </span>
        )}
      </EpisodeInfo>
      
      {/* description */}
      <Description>{description}</Description>
      
      {/* air date and expiration */}
      <Metadata>
        <span>Aired: {premiereDate}</span>
        <MetadataSeparator>|</MetadataSeparator>
        <span>Expires: {expirationDate}</span>
      </Metadata>
    </Container>
  );
};

export default EpisodeDetails;