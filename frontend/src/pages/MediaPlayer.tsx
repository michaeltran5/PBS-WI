import { useState, useEffect, useRef } from 'react';
import { VideoPlayer } from '../components/VideoPlayer';
import { EpisodesList } from '../components/EpisodesList';
import EpisodeDetails from '../components/EpisodeDetails';
import TabNavigation from '../components/TabNavigation';
import RecommendedShows from '../components/RecommendedShows';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useGetShowsByGenreQuery } from '../redux/rtkQuery/customApi';
import {
  Container, Content, TabContent, TabPanel, LoadingContainer, LoadingText, RecommendationsContainer,
  RecommendationsTitle, RecommendationsLoadingText, NoRecommendationsText
} from '../styled/MediaPlayer.styled';
import { useGetShowByIdQuery, useGetShowSeasonsQuery } from '../redux/rtkQuery/pbsWiApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { useParams } from 'react-router';

const MediaPlayer = () => {
  const { showId } = useParams<{ showId: string }>();
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>('about');
  const contentRef = useRef<HTMLDivElement>(null);

  // fetch show details to get genre
  const { data: showData, isLoading: isShowLoading } = useGetShowByIdQuery(showId ? { id: showId } : skipToken);

  const getSeasonPage = (seasonNumber: number, totalSeasons?: number, perPage = 25) => {
    if (!totalSeasons) return 1;
    const ordinalIndex = totalSeasons - seasonNumber;
    return Math.floor(ordinalIndex / perPage) + 1;
  };

  // Always fetch page 1 first to get season count
  const {
    data: initialSeasonsResponse,
    isLoading: isInitialLoading
  } = useGetShowSeasonsQuery(
    showId ? { id: showId, params: { page: 1, sort: '-ordinal' } } : skipToken
  );

  const seasonPage = initialSeasonsResponse?.pagination?.count
    ? getSeasonPage(selectedSeason, initialSeasonsResponse.pagination.count)
    : 1;

  const {
    data: seasonsResponse,
    isLoading: isSeasonsLoading
  } = useGetShowSeasonsQuery(
    showId ? { id: showId, params: { page: seasonPage } } : skipToken
  );

  const seasons = seasonsResponse?.items ?? [];

  // fetch related shows by genre
  const { data: genreShowsResponse, isLoading: recommendationsLoading } =
    useGetShowsByGenreQuery(showData ? { genreSlug: showData?.attributes.genre.slug } : skipToken);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    if (contentRef.current) {
      const tabContentTop = contentRef.current.offsetTop;
      window.scrollTo({
        top: tabContentTop - 80,
        behavior: 'smooth'
      });
    }

    //reset layout when episode load
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 50);
  };

  // handle episode selection
  const handleEpisodeSelect = (episodeId: string) => {
    setSelectedEpisodeId(episodeId);
    setActiveTab('about');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isInitialLoading || isSeasonsLoading || isShowLoading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingText>Loading content...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        <VideoPlayer episodeId={selectedEpisodeId} fullWidth={true} />

        <TabContent ref={contentRef}>
          <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

          <TabPanel isActive={activeTab === 'about'}>
            <EpisodeDetails episodeId={selectedEpisodeId} />
          </TabPanel>

          <TabPanel isActive={activeTab === 'episodes'}>
            {seasons && seasonsResponse && <EpisodesList
              seasons={seasons}
              seasonsCount={seasonsResponse?.pagination.count}
              selectedSeason={selectedSeason}
              setSelectedSeason={setSelectedSeason}
              onEpisodeSelect={handleEpisodeSelect}
              selectedEpisodeId={selectedEpisodeId || undefined}
            />}
          </TabPanel>

          <TabPanel isActive={activeTab === 'recommended'}>
            <RecommendationsContainer>
              <RecommendationsTitle>You May Also Like</RecommendationsTitle>

              {recommendationsLoading && (
                <RecommendationsLoadingText>Loading recommendations...</RecommendationsLoadingText>
              )}

              {!recommendationsLoading && genreShowsResponse && genreShowsResponse.length === 0 && (
                <NoRecommendationsText>No recommendations available</NoRecommendationsText>
              )}

              {genreShowsResponse && genreShowsResponse.length > 0 && (
                <RecommendedShows shows={genreShowsResponse} />
              )}
            </RecommendationsContainer>
          </TabPanel>
        </TabContent>
      </Content>
    </Container>
  );
};

export default MediaPlayer;