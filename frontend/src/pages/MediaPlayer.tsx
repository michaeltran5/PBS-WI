import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { VideoPlayer } from '../components/VideoPlayer';
import { EpisodesList } from '../components/EpisodesList';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useGetEpisodesByShowIdQuery } from '../redux/rtkQuery/pbsWiApi';
import { Episode } from '../types/Episode';

const MediaPlayer = () => {
  const { showId = 'nova' } = useParams();
  const [currentEpisodeId, setCurrentEpisodeId] = useState<string | null>(null);
  
  //fetch episodes for the selected show
  const { data: episodesResponse, isLoading } = useGetEpisodesByShowIdQuery(showId);
  
  //when episodes load, find and set the first episode from the first season
  useEffect(() => {
    if (episodesResponse?.data && episodesResponse.data.length > 0 && !currentEpisodeId) {
      //sort episodes by season and episode ordinal
      const sortedEpisodes = [...episodesResponse.data].sort((a: Episode, b: Episode) => {
        //first sort by season ordinal
        const seasonA = a.attributes.parent_tree?.attributes?.season?.attributes?.ordinal || 0;
        const seasonB = b.attributes.parent_tree?.attributes?.season?.attributes?.ordinal || 0;
        
        if (seasonA !== seasonB) {
          return seasonA - seasonB;
        }
        
        //if same season, sort by episode ordinal
        const episodeA = a.attributes.parent_tree?.attributes?.ordinal || 0;
        const episodeB = b.attributes.parent_tree?.attributes?.ordinal || 0;
        return episodeA - episodeB;
      });
      
      //set the first episode after sorting
      if (sortedEpisodes.length > 0) {
        setCurrentEpisodeId(sortedEpisodes[0].id);
      }
    }
  }, [episodesResponse, currentEpisodeId]);

  if (isLoading || !currentEpisodeId) {
    return (
      <div className="bg-navy-900 min-h-screen">
        <div className="px-8 pb-6" style={{
          paddingTop: 'calc(60px + 1rem)', 
          marginTop: '1rem' 
        }}>
          <div className="text-white">Loading content...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-navy-900 min-h-screen">
      <div className="px-8 pb-6" style={{
        paddingTop: 'calc(60px + 1rem)', 
        marginTop: '1rem' 
      }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ marginLeft: '1.5rem', marginRight: '1.5rem', width: '950px', minHeight: '500px' }}>
            <VideoPlayer episodeId={currentEpisodeId} />
          </div>
          <EpisodesList showId={showId} onEpisodeSelect={setCurrentEpisodeId} />
        </div>
      </div>
    </div>
  );
};

export default MediaPlayer;