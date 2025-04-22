import { useGetMostRecentlyWatchedShowQuery, useGetShowsByGenreQuery } from '../redux/rtkQuery/customApi';
import { PBS_GENRES } from '../constants/genres';
import { MediaRow } from '../components/MediaRow';
import { Banner } from '../components/Banner';
import { useAuth } from '../components/AuthContext';
import {useGetTopPicksQuery } from '../redux/rtkQuery/personalizeApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { TopPicksCarousel } from '../components/TopPicksCarousel';

function Browse() {
  const { isAuthenticated, user } = useAuth();

  // Always fetch genre-based recommendations regardless of authentication state
  const { data: artsAndMusicShows } = useGetShowsByGenreQuery({ genreSlug: PBS_GENRES.ARTS_AND_MUSIC.slug });
  const { data: dramaShows } = useGetShowsByGenreQuery({ genreSlug: PBS_GENRES.DRAMA.slug });
  const { data: historyShows } = useGetShowsByGenreQuery({ genreSlug: PBS_GENRES.HISTORY.slug });
  const { data: cultureShows } = useGetShowsByGenreQuery({ genreSlug: PBS_GENRES.CULTURE.slug });
  const { data: scienceAndNatureShows } = useGetShowsByGenreQuery({ genreSlug: PBS_GENRES.SCIENCE_AND_NATURE.slug });
  
  const { data: topPicksShows } = useGetTopPicksQuery(
    isAuthenticated && user?.uid ? { userId: user.uid } : skipToken
  );
  
  return (
    <div style={{ marginTop: 73 }}>
      <Banner />
      
      {/* PBS content - only shown when authenticated */}
      <TopPicksCarousel />
      
      {/* Genre-based recommendations - shown to all users */}
      {artsAndMusicShows && artsAndMusicShows.length > 0 && (
        <MediaRow title="Arts and Music" shows={artsAndMusicShows} />
      )}
      
      {dramaShows && dramaShows.length > 0 && (
        <MediaRow title="Drama" shows={dramaShows} />
      )}
      
      {historyShows && historyShows.length > 0 && (
        <MediaRow title="History" shows={historyShows} />
      )}
      
      {cultureShows && cultureShows.length > 0 && (
        <MediaRow title="Culture" shows={cultureShows} />
      )}
      
      {scienceAndNatureShows && scienceAndNatureShows.length > 0 && (
        <MediaRow title="Science and Nature" shows={scienceAndNatureShows} />
      )}
    </div>
  )
}

export default Browse