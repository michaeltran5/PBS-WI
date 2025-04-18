import { useGetMostRecentlyWatchedShowQuery, useGetShowsByGenreQuery } from '../redux/rtkQuery/customApi';
import { PBS_GENRES } from '../constants/genres';
import { MediaRow } from '../components/MediaRow';
import { Banner } from '../components/Banner';
import { useAuth } from '../components/AuthContext';
import { useGetBecauseYouWatchedQuery, useGetTopPicksQuery } from '../redux/rtkQuery/personalizeApi';
import { skipToken } from '@reduxjs/toolkit/query';

function Browse() {
  const { data: artsAndMusicShows } = useGetShowsByGenreQuery({ genreSlug: PBS_GENRES.ARTS_AND_MUSIC.slug });
  const { data: dramaShows } = useGetShowsByGenreQuery({ genreSlug: PBS_GENRES.DRAMA.slug });
  const { data: historyShows } = useGetShowsByGenreQuery({ genreSlug: PBS_GENRES.HISTORY.slug });
  const { data: cultureShows } = useGetShowsByGenreQuery({ genreSlug: PBS_GENRES.CULTURE.slug });
  const { data: scienceAndNatureShows } = useGetShowsByGenreQuery({ genreSlug: PBS_GENRES.SCIENCE_AND_NATURE.slug });

  const { isAuthenticated, user } = useAuth();
  
  const { data: mostRecentlyWatchedShow } = useGetMostRecentlyWatchedShowQuery(user?.uid ? { userId: user?.uid } : skipToken);
  const { data: topPicksShows } = useGetTopPicksQuery(user?.uid && isAuthenticated ? { userId: user?.uid } : skipToken);
  const { data: becauseYouWatchedShows } = useGetBecauseYouWatchedQuery(user?.uid && isAuthenticated && mostRecentlyWatchedShow ? { recentItemId: mostRecentlyWatchedShow.itemId, userId: user?.uid, } : skipToken);
  
  return (
    <div style={{ marginTop: 73 }}>
      <Banner />
      {topPicksShows && <MediaRow title="Top Picks" shows={topPicksShows} />}
      {becauseYouWatchedShows && mostRecentlyWatchedShow && <MediaRow title={`Because You Watched ${mostRecentlyWatchedShow.title}`} shows={becauseYouWatchedShows} />}
      {artsAndMusicShows && <MediaRow title="Arts and Music" shows={artsAndMusicShows} />}
      {dramaShows && <MediaRow title="Drama" shows={dramaShows} />}
      {historyShows && <MediaRow title="History" shows={historyShows} />}
      {cultureShows && <MediaRow title="Culture" shows={cultureShows} />}
      {scienceAndNatureShows && <MediaRow title="Science and Nature" shows={scienceAndNatureShows} />}
    </div>
  )
}

export default Browse

