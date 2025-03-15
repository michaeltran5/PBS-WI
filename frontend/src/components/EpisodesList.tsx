import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useGetEpisodesByShowIdQuery } from '../redux/rtkQuery/pbsWiApi';
import { Episode } from '../types/Episode';

interface EpisodesListProps {
  showId?: string;
  onEpisodeSelect?: (episodeId: string) => void;
}

export const EpisodesList: React.FC<EpisodesListProps> = ({ 
  showId = 'nova',
  onEpisodeSelect 
}) => {
  const { data: episodesResponse, isLoading, error } = useGetEpisodesByShowIdQuery(showId);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [listTitle, setListTitle] = useState('Episodes');

  useEffect(() => {
    if (episodesResponse?.data) {
      const allEpisodes = episodesResponse.data;
      
      //sort episodes by season and episode ordinal
      const sortedEpisodes = [...allEpisodes].sort((a: Episode, b: Episode) => {
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
      
      //find the earliest season number
      let earliestSeason: number | null = null;
      if (sortedEpisodes.length > 0) {
        earliestSeason = sortedEpisodes[0].attributes.parent_tree?.attributes?.season?.attributes?.ordinal || null;
      }
      
      //filter episodes to show only the earliest season
      let filteredEpisodes = sortedEpisodes;
      if (earliestSeason !== null) {
        filteredEpisodes = sortedEpisodes.filter(episode => 
          episode.attributes.parent_tree?.attributes?.season?.attributes?.ordinal === earliestSeason
        );
        setListTitle(`Season ${earliestSeason} Episodes`);
      } else {
        setListTitle('Episodes');
      }
      
      setEpisodes(filteredEpisodes);
    }
  }, [episodesResponse]);

  const getEpisodeImage = (episode: Episode) => {
    if (!episode.attributes.images || episode.attributes.images.length === 0) {
      return '/api/placeholder/160/90';
    }
    const imageObj = episode.attributes.images.find(img => 
      img.profile === 'asset-mezzanine-16x9' || 
      img.profile === 'episode-mezzanine-16x9'
    );
    return imageObj ? imageObj.image : '/api/placeholder/160/90';
  };

  const handleEpisodeClick = (episodeId: string) => {
    if (onEpisodeSelect) {
      onEpisodeSelect(episodeId);
    }
  };

  if (isLoading) {
    return <div style={{ width: '280px' }} className="text-white">Loading episodes...</div>;
  }
  
  if (error) {
    return <div style={{ width: '280px' }} className="text-danger">
      Error: {error instanceof Error ? error.message : 'Failed to load episodes'}
    </div>;
  }

  //episode card style
  const cardStyles = {
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  return (
    <div style={{ width: '400px', flexShrink: 0 }}>
      <h3 className="text-white mb-3">{listTitle}</h3>
      
      {episodes.length > 0 ? (
        <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '8px', width: '400px' }}>
          {episodes.map(episode => (
            <Card 
              key={episode.id} 
              className="mb-3" 
              text="white"
              onClick={() => handleEpisodeClick(episode.id)}
              style={{ 
                ...cardStyles,
                cursor: 'pointer', 
                height: '90px',
                transition: 'background-color 0.2s ease' 
              }}
            >
              <Row className="g-0 h-100">
                <Col xs={4} className="pe-0">
                  <Card.Img 
                    src={getEpisodeImage(episode)} 
                    alt={episode.attributes.title}
                    style={{ height: '100%', objectFit: 'cover' }}
                  />
                </Col>
                <Col xs={8}>
                  <Card.Body className="p-2">
                    <Card.Title className="fs-6 mb-1" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {episode.attributes.title}
                    </Card.Title>
                    <Card.Text className="text-white small" style={{ fontSize: '0.75rem', maxHeight: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {episode.attributes.description_short || "No description available"}
                    </Card.Text>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-white">No episodes available</p>
      )}
    </div>
  );
};