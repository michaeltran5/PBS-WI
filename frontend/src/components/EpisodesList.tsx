import React, { useEffect, useRef, useState } from 'react';
import SeasonSelector from './SeasonSelector';
import Episode from './Episode';
import {
  Container, EpisodesContainer, EpisodeSpacer, LoadingText, ErrorText, NoEpisodesText
} from '../styled/EpisodesList.styled';
import { useGetSeasonEpisodesQuery } from '../redux/rtkQuery/pbsWiApi';
import { Season } from '../types/Season';
import { skipToken } from '@reduxjs/toolkit/query';
import InfiniteScroll from 'react-infinite-scroll-component';

type Props = {
  selectedSeason: number;
  setSelectedSeason: (season: number) => void;
  seasons: Season[];
  seasonsCount: number;
  onEpisodeSelect?: (episodeId: string) => void;
  selectedEpisodeId?: string;
}
export const EpisodesList = ({ selectedSeason, setSelectedSeason, seasons, seasonsCount, onEpisodeSelect, selectedEpisodeId }: Props) => {
  const seasonId = seasons?.find(
    (s) => s.attributes.ordinal === selectedSeason
  )?.id;

  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [seasonId]);

  const { data: episodesResponse, isLoading, isFetching, error } = useGetSeasonEpisodesQuery(seasonId ? { id: seasonId, params: { page } } : skipToken);
  const episodes = episodesResponse?.items;

  useEffect(() => {
    if (episodes && episodes.length > 0 && !selectedEpisodeId && onEpisodeSelect) {
      onEpisodeSelect(episodes[0].id);
    }
  }, [episodes, selectedEpisodeId, onEpisodeSelect]);

  const handleSeasonChange = (season: number) => {
    setSelectedSeason(season);
  };

  const handleEpisodeClick = (episodeId: string) => {
    if (onEpisodeSelect) {
      onEpisodeSelect(episodeId);
    }
  };

  const fetchMoreData = () => {
    if (!isFetching && episodesResponse?.pagination.has_more) {
      setPage(prev => prev + 1);
    }
  };

  if (isLoading) {
    return <LoadingText>Loading episodes...</LoadingText>;
  }

  if (error) {
    return <ErrorText>
      Error: {error instanceof Error ? error.message : 'Failed to load episodes'}
    </ErrorText>;
  }

  return (
    <Container>
      {/* season selector */}
      <SeasonSelector seasonsCount={seasonsCount} selectedSeason={selectedSeason} onSeasonChange={handleSeasonChange} />

      {episodes && episodes.length > 0 ? (
        <InfiniteScroll
          dataLength={episodes.length}
          next={fetchMoreData}
          hasMore={episodesResponse?.pagination.has_more}
          loader={<LoadingText>Loading more episodes...</LoadingText>}
        >
          <EpisodesContainer>
            {episodes.map((episode, index) => (
              <React.Fragment key={episode.id}>
                {/* episode component */}
                <Episode
                  episode={episode}
                  selectedSeason={selectedSeason}
                  onClick={handleEpisodeClick}
                  isActive={selectedEpisodeId ? episode.id === selectedEpisodeId : false}
                />

                {/* spacing between episodes */}
                {index < episodes.length - 1 && <EpisodeSpacer />}
              </React.Fragment>
            ))}
          </EpisodesContainer>
        </InfiniteScroll>
      ) : (
        <NoEpisodesText>No episodes available</NoEpisodesText>
      )}
    </Container>
  );
};

export default EpisodesList;