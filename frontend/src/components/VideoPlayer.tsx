import React from 'react';
import { useGetAssetByIdQuery } from '../redux/rtkQuery/pbsWiApi';

interface VideoPlayerProps {
  episodeId?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  episodeId = 'c445e87d-40fd-43f1-9ac2-36725d4fea37' 
}) => {
  const { data, isLoading, error } = useGetAssetByIdQuery(episodeId);
  
  const episode = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        Loading episode...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-400">
        Error: {error instanceof Error ? error.message : 'An error occurred'}
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

  //extract iframe source URL from the player code - handle undefined player_code
  const playerCode = episode.attributes.player_code || '';
  const srcMatch = playerCode.match(/src=['"]([^'"]+)['"]/);
  let iframeSrc = srcMatch ? srcMatch[1] : '';

  //iframe formatting
  if (iframeSrc) {
    iframeSrc = iframeSrc.replace('autoplay=false', 'autoplay=false&maxwidth=950&maxheight=534');
  }

  //format dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  //get season and episode number if available
  const seasonNumber = episode.attributes.parent_tree?.attributes?.season?.attributes?.ordinal;
  const episodeNumber = episode.attributes.parent_tree?.attributes?.ordinal;
  
  //get and format availability dates
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
      
      {/* video details and description */}
      <div className="text-white" style={{ width: '950px', marginTop: '16px' }}>
        {/* title */}
        <h2 className="text-2xl font-bold">{episode.attributes.title}</h2>
        
        {/* season, show, duration */}
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
        
        {/* description */}
        <p className="text-gray-200 mt-3 mb-3">
          {description}
        </p>
        
        {/* public availability */}
        <div className="text-gray-400">
          <span>Aired: {premiereDate}</span>
          <span className="mx-2">|</span>
          <span className="text-yellow-300">Expires: {expirationDate}</span>
        </div>
      </div>
    </div>
  );
};