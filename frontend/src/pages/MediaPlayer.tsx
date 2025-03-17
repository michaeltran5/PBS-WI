import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { VideoPlayer } from '../components/VideoPlayer';
import { EpisodesList } from '../components/EpisodesList';
import EpisodeDetails from '../components/EpisodeDetails';
import TabNavigation from '../components/TabNavigation';
import RecommendedShows from '../components/RecommendedShows';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useGetEpisodesByShowIdQuery, useGetShowByIdQuery,useGetShowsByGenreQuery } from '../redux/rtkQuery/pbsWiApi';
import { Episode } from '../types/Episode';
import { Show } from '../types/Show';
import { Container, Content, TabContent, TabPanel, LoadingContainer, LoadingText, RecommendationsContainer,
  RecommendationsTitle, RecommendationsSubtitle, RecommendationsLoadingText, NoRecommendationsText
} from '../styled/MediaPlayer.styled';

const MediaPlayer = () => {
  const { showId = 'nova' } = useParams();
  const [currentEpisodeId, setCurrentEpisodeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('about'); // default to about tab
  const [showGenre, setShowGenre] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Show[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // fetch episodes for the show
  const { data: episodesResponse, isLoading: episodesLoading } = useGetEpisodesByShowIdQuery(showId);
  
  // fetch show details to get genre
  const { data: showData, isLoading: showLoading } = useGetShowByIdQuery(showId);
  
  // fetch related shows by genre
  const { data: genreShowsResponse, isLoading: recommendationsLoading } = 
    useGetShowsByGenreQuery(showGenre || '', { 
      skip: !showGenre 
    });
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // extract genre from show data
  useEffect(() => {
    const showDetails = showData?.data || showData;
    if (showDetails?.attributes?.genre?.title) {
      const genreTitle = showDetails.attributes.genre.title;
      const genreSlug = genreTitle.toLowerCase().replace(/\s+/g, '-');
      setShowGenre(genreSlug);
    }
  }, [showData]);
  
  // set recs from genre shows
  useEffect(() => {
    if (genreShowsResponse?.data) {
      // filter out current show
      const filteredShows = genreShowsResponse.data
        .filter((show: Show) => show.id !== showId)
        .slice(0, 5);
      
      setRecommendations(filteredShows);
    }
  }, [genreShowsResponse, showId]);
  
  // select first ep as defualt
  useEffect(() => {
    const episodes = episodesResponse?.data || episodesResponse;
    if (episodes && episodes.length > 0 && !currentEpisodeId) {
      const sortedEpisodes = [...episodes].sort((a: Episode, b: Episode) => {
        const seasonA = a.attributes.parent_tree?.attributes?.season?.attributes?.ordinal || 0;
        const seasonB = b.attributes.parent_tree?.attributes?.season?.attributes?.ordinal || 0;
        
        if (seasonA !== seasonB) {
          return seasonA - seasonB;
        }
        
        const episodeA = a.attributes.parent_tree?.attributes?.ordinal || 0;
        const episodeB = b.attributes.parent_tree?.attributes?.ordinal || 0;
        return episodeA - episodeB;
      });
      
      if (sortedEpisodes.length > 0) {
        setCurrentEpisodeId(sortedEpisodes[0].id);
      }
    }
  }, [episodesResponse, currentEpisodeId]);

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
    setCurrentEpisodeId(episodeId);
    setActiveTab('about'); 
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (episodesLoading || !currentEpisodeId) {
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
        <VideoPlayer episodeId={currentEpisodeId} fullWidth={true} />
        
        <TabContent ref={contentRef}>
          <TabNavigation activeTab={activeTab} onTabChange={handleTabChange}/>
          
          <TabPanel isActive={activeTab === 'about'}>
            <EpisodeDetails episodeId={currentEpisodeId} />
          </TabPanel>
          
          <TabPanel isActive={activeTab === 'episodes'}>
            <EpisodesList showId={showId} onEpisodeSelect={handleEpisodeSelect} currentEpisodeId={currentEpisodeId || undefined}/>
          </TabPanel>
          
          <TabPanel isActive={activeTab === 'recommended'}>
            <RecommendationsContainer>
              <RecommendationsTitle>You May Also Like</RecommendationsTitle>
              
              {recommendationsLoading && (
                <RecommendationsLoadingText>Loading recommendations...</RecommendationsLoadingText>
              )}
              
              {!recommendationsLoading && recommendations.length === 0 && (
                <NoRecommendationsText>No recommendations available</NoRecommendationsText>
              )}
              
              {recommendations.length > 0 && (
                <><RecommendedShows shows={recommendations} /></>
              )}
            </RecommendationsContainer>
          </TabPanel>
        </TabContent>
      </Content>
    </Container>
  );
};

export default MediaPlayer;