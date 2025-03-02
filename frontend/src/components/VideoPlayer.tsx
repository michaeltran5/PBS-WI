import React, { useState, useEffect } from 'react';
import { Asset, APIResponse } from '../types/pbs';

interface VideoPlayerProps {
  episodeId?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  episodeId = 'c445e87d-40fd-43f1-9ac2-36725d4fea37' 
}) => {
  const [episode, setEpisode] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //fetch episode asset from backend
  useEffect(() => {
    const fetchEpisode = async () => {
      setLoading(true);
      try {
        const url = `/api/assets/${episodeId}?platform-slug=partnerplayer`;
        console.log('Fetching from backend:', url);
        
        const response = await fetch(url);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result: APIResponse = await response.json();
        setEpisode(result.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching episode:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisode();
  }, [episodeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        Loading episode...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-400">
        Error: {error}
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        No content available
      </div>
    );
  }

  //extract iframe source url from the player code
  const srcMatch = episode.attributes.player_code?.match(/src=['"]([^'"]+)['"]/);
  let iframeSrc = srcMatch ? srcMatch[1] : '';

  //ifram formatting
  if (iframeSrc) {
    iframeSrc = iframeSrc.replace('autoplay=false', 'autoplay=false&maxwidth=950&maxheight=534');
  }

  //format dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  //get season and epsiode number if available
  const seasonNumber = episode.attributes.parent_tree?.attributes?.season?.attributes?.ordinal;
  const episodeNumber = episode.attributes.parent_tree?.attributes?.ordinal;
  
  //get and formate availability dates
  const premiereDate = formatDate(episode.attributes.premiered_on || null);
  const expirationDate = formatDate(episode.attributes.availabilities?.public?.end || null);
  
  //get description
  const description = episode.attributes.description_long || episode.attributes.description_short;
  
  //formatting duration
  const minutes = episode.attributes.duration ? Math.floor(episode.attributes.duration / 60) : 0;
  const seconds = episode.attributes.duration ? episode.attributes.duration % 60 : 0;
  const durationText = `${minutes}m ${seconds}s`;
    
  return (
    <div>
      <div style={{borderRadius: '8px', overflow: 'hidden'}}>
        <iframe src={iframeSrc} width="950" height="534" style={{ border: "none" }} 
        allowFullScreen allow="encrypted-media" title={episode.attributes.title}/>
      </div>
      
      {/*video details and description stuff*/}
      <div className="text-white" style={{ width: '950px', marginTop: '16px' }}>
        {/*title*/}
        <h2 className="text-2xl font-bold">{episode.attributes.title}</h2>
        
        {/*season, show, duration*/}
        <div className="mt-2" style={{ fontWeight: 'bold', color: '#ffcf00' }}>
          {seasonNumber !== undefined && episodeNumber !== undefined && (
            <span>Season {seasonNumber} • Episode {episodeNumber}</span>
          )}
          {episode.attributes.duration && (
            <span>
              {seasonNumber !== undefined && episodeNumber !== undefined && ' | '}
              {durationText}
            </span>
          )}
        </div>
        
        {/*description*/}
        <p className="text-gray-200 mt-3 mb-3">
          {description}
        </p>
        
        {/*public availability*/}
        <div className="text-gray-400">
          <span>Aired: {premiereDate}</span>
          <span className="mx-2">|</span>
          <span className="text-yellow-300">Expires: {expirationDate}</span>
        </div>
      </div>
    </div>
  );
};