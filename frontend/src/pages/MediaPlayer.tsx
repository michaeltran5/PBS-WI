import React, { useState } from 'react';
import { VideoPlayer } from '../components/VideoPlayer';
import { EpisodesList } from '../components/EpisodesList';
import 'bootstrap/dist/css/bootstrap.min.css';

const MediaPlayer = () => {
  const [currentEpisodeId, setCurrentEpisodeId] = useState('c445e87d-40fd-43f1-9ac2-36725d4fea37');

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
          <EpisodesList showId="nova" onEpisodeSelect={setCurrentEpisodeId} />
        </div>
      </div>
    </div>
  );
};

export default MediaPlayer;