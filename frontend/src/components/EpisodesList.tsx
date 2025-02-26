import React, { useState, useEffect } from 'react';
import { PBS_API } from '../config/constants';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Episode {
  id: string;
  attributes: {
    title: string;
    description_short: string;
    images: Array<{
      image: string;
      profile: string;
    }>;
  };
}

interface EpisodesListProps {
  showId?: string;
  onEpisodeSelect?: (episodeId: string) => void;
}

export const EpisodesList: React.FC<EpisodesListProps> = ({ 
  showId = 'nova',
  onEpisodeSelect 
}) => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [allEpisodes, setAllEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listTitle, setListTitle] = useState('Episodes');

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        //get the showID
        const showUrl = `/api/v1/shows/${showId}/?platform-slug=partnerplayer`;
        const showResponse = await fetch(showUrl, {
          headers: {
            Authorization: 'Basic ' + btoa(`${PBS_API.CLIENT_ID}:${PBS_API.CLIENT_SECRET}`),
            Accept: 'application/json',
          },
        });

        if (!showResponse.ok) throw new Error(`HTTP error! status: ${showResponse.status}`);
        const showResult = await showResponse.json();
        const resolvedShowId = showResult.data.id;

        //fetch the episodes from that show
        const episodesUrl = `/api/v1/assets/?platform-slug=partnerplayer&show-id=${resolvedShowId}&type=full_length`;
        const episodesResponse = await fetch(episodesUrl, {
          headers: {
            Authorization: 'Basic ' + btoa(`${PBS_API.CLIENT_ID}:${PBS_API.CLIENT_SECRET}`),
            Accept: 'application/json',
          },
        });

        if (!episodesResponse.ok) throw new Error(`HTTP error! status: ${episodesResponse.status}`);
        const episodesResult = await episodesResponse.json();
        
        setAllEpisodes(episodesResult.data);
        
        //hardcoded getting filtering episodes from season 51
        const season51Episodes = episodesResult.data.filter((episode: Episode) => {
          const title = episode.attributes.title || '';
          return title.includes('S51') || 
                 title.includes('Season 51') || 
                 title.includes('s51');
        });
        
        if (season51Episodes.length === 0) {
          setListTitle('Recent Episodes');
          setEpisodes(episodesResult.data.slice(0, 10));
        } else {
          setListTitle('Season 51 Episodes');
          setEpisodes(season51Episodes);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching episodes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [showId]);

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

  if (loading) {
    return <div style={{ width: '280px' }} className="text-white">Loading episodes...</div>;
  }
  
  if (error) {
    return <div style={{ width: '280px' }} className="text-danger">Error: {error}</div>;
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