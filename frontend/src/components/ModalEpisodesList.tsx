import React, { useState } from 'react';
import { useGetShowSeasonsQuery, useGetSeasonEpisodesQuery } from '../redux/rtkQuery/pbsWiApi';
import SeasonSelector from './SeasonSelector';
import Episode from './Episode'; 
import { skipToken } from '@reduxjs/toolkit/query';
import { useNavigate } from 'react-router-dom';
import { Container, EpisodesContainer, EpisodeSpacer, LoadingText, ErrorText, NoEpisodesText } from '../styled/ModalEpisodesList.styled';

interface ModalEpisodesListProps {
  showId: string;
  onHide?: () => void;
  onEpisodeSelect?: (episodeId: string) => void;
}

const ModalEpisodesList: React.FC<ModalEpisodesListProps> = ({ showId, onHide,onEpisodeSelect }) => {
  const navigate = useNavigate();
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [page, setPage] = useState(1);
  
  const { data: seasonsResponse, isLoading: isSeasonsLoading, error: seasonsError } = useGetShowSeasonsQuery(
    showId ? { id: showId, params: { page: 1, sort: '-ordinal' } } : skipToken
  );

  const seasons = seasonsResponse?.items ?? [];
  const seasonsCount = seasonsResponse?.pagination?.count ?? 0;
  
  const seasonId = seasons?.find(
    (s) => s.attributes.ordinal === selectedSeason
  )?.id;

  const { data: episodesResponse, isLoading: isEpisodesLoading, error: episodesError } = useGetSeasonEpisodesQuery(
    seasonId ? { id: seasonId, params: { page } } : skipToken
  );

  const episodes = episodesResponse?.items ?? [];

  const handleSeasonChange = (season: number) => {
    setSelectedSeason(season);
    setPage(1);
  };

  const handleEpisodeSelect = (episodeId: string) => {
    if (onEpisodeSelect) {
      onEpisodeSelect(episodeId);
    } else {
      if (onHide) {
        onHide();
      }
      
      setTimeout(() => {
        window.location.href = `/watch/${showId}?episodeId=${episodeId}`;
      }, 100);
    }
  };

  if (isSeasonsLoading) {
    return <LoadingText>Loading seasons...</LoadingText>;
  }

  if (seasonsError) {
    return <ErrorText>
      Error: {seasonsError instanceof Error ? seasonsError.message : 'Failed to load seasons'}
    </ErrorText>;
  }

  return (
    <Container>
      <SeasonSelector seasonsCount={seasonsCount} selectedSeason={selectedSeason} onSeasonChange={handleSeasonChange}/>

      {isEpisodesLoading && <LoadingText>Loading episodes...</LoadingText>}
      
      {episodesError && <ErrorText>
        Error: {episodesError instanceof Error ? episodesError.message : 'Failed to load episodes'}
      </ErrorText>}
      
      {!isEpisodesLoading && !episodesError && episodes.length > 0 && (
        <EpisodesContainer>
          {episodes.map((episode, index) => (
            <React.Fragment key={episode.id}>
              <Episode episode={episode} selectedSeason={selectedSeason} onClick={handleEpisodeSelect} isActive={false}/>

              {index < episodes.length - 1 && <EpisodeSpacer />}
            </React.Fragment>
          ))}
        </EpisodesContainer>
      )}
      
      {!isEpisodesLoading && !episodesError && episodes.length === 0 && (
        <NoEpisodesText>No episodes available for this season</NoEpisodesText>
      )}
    </Container>
  );
};

export default ModalEpisodesList;