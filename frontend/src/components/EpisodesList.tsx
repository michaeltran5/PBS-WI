import React, { useState, useEffect } from 'react';
import { useGetEpisodesByShowIdQuery } from '../redux/rtkQuery/pbsWiApi';
import { Episode as EpisodeType } from '../types/Episode';
import SeasonSelector from './SeasonSelector';
import Episode from './Episode';
import { Container, EpisodesContainer, EpisodeSpacer, LoadingText, ErrorText, NoEpisodesText
} from '../styled/EpisodesList.styled';

interface EpisodesListProps {
  showId: string;
  onEpisodeSelect?: (episodeId: string) => void;
  currentEpisodeId?: string;
}

export const EpisodesList: React.FC<EpisodesListProps> = ({ 
  showId,
  onEpisodeSelect,
  currentEpisodeId
}) => {
  const { data: episodesResponse, isLoading, error } = useGetEpisodesByShowIdQuery(showId);
  const [episodes, setEpisodes] = useState<EpisodeType[]>([]);
  const [allEpisodes, setAllEpisodes] = useState<EpisodeType[]>([]);
  const [seasons, setSeasons] = useState<number[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

  useEffect(() => {
    if (episodesResponse?.data) {
      const episodesData = episodesResponse.data;
      
      // sort episodes by season and episode number
      const sortedEpisodes = [...episodesData].sort((a: EpisodeType, b: EpisodeType) => {
        const seasonA = a.attributes.parent_tree?.attributes?.season?.attributes?.ordinal || 0;
        const seasonB = b.attributes.parent_tree?.attributes?.season?.attributes?.ordinal || 0;
        
        if (seasonA !== seasonB) {
          return seasonA - seasonB;
        }
        
        const episodeA = a.attributes.parent_tree?.attributes?.ordinal || 0;
        const episodeB = b.attributes.parent_tree?.attributes?.ordinal || 0;
        return episodeA - episodeB;
      });
      
      setAllEpisodes(sortedEpisodes);
      
      const uniqueSeasons: number[] = Array.from(
        new Set(
          sortedEpisodes
            .map(episode => episode.attributes.parent_tree?.attributes?.season?.attributes?.ordinal)
            .filter((season): season is number => season !== undefined)
        )
      ).sort((a, b) => a - b);
      
      setSeasons(uniqueSeasons);
      
      // set first season as default
      if (uniqueSeasons.length > 0 && !selectedSeason) {
        setSelectedSeason(uniqueSeasons[0]);
      }
    }
  }, [episodesResponse, selectedSeason]);
  
  useEffect(() => {
    if (allEpisodes.length > 0 && selectedSeason !== null) {
      const filteredEpisodes = allEpisodes.filter(episode => 
        episode.attributes.parent_tree?.attributes?.season?.attributes?.ordinal === selectedSeason
      );
      
      setEpisodes(filteredEpisodes);
    } else {
      setEpisodes(allEpisodes);
    }
  }, [allEpisodes, selectedSeason]);

  // handle season change
  const handleSeasonChange = (season: number) => {
    setSelectedSeason(season);
  };

  // handle episode selection
  const handleEpisodeClick = (episodeId: string) => {
    if (onEpisodeSelect) {
      onEpisodeSelect(episodeId);
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
      <SeasonSelector seasons={seasons} selectedSeason={selectedSeason} onSeasonChange={handleSeasonChange}/>
      
      {episodes.length > 0 ? (
        <EpisodesContainer>
          {episodes.map((episode, index) => (
            <React.Fragment key={episode.id}>
              {/* episode component */}
              <Episode 
                episode={episode} 
                onClick={handleEpisodeClick} 
                isActive={currentEpisodeId ? episode.id === currentEpisodeId : false}
              />
              
              {/* spacing between episodes */}
              {index < episodes.length - 1 && <EpisodeSpacer />}
            </React.Fragment>
          ))}
        </EpisodesContainer>
      ) : (
        <NoEpisodesText>No episodes available</NoEpisodesText>
      )}
    </Container>
  );
};

export default EpisodesList;