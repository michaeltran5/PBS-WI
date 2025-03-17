import { useGetTopShowsQuery } from '../redux/rtkQuery/pbsWiApi';
import { PBS_GENRES } from '../constants/genres';
import { MediaRow } from '../components/MediaRow';
import { Banner } from '../components/Banner';

function Browse() {
  const { data: artsAndMusicShows } = useGetTopShowsQuery({ params: { 'genre-slug': PBS_GENRES.ARTS_AND_MUSIC } });
  const { data: dramaShows } = useGetTopShowsQuery({ params: { 'genre-slug': PBS_GENRES.DRAMA } });
  const { data: historyShows } = useGetTopShowsQuery({ params: { 'genre-slug': PBS_GENRES.HISTORY } });
  const { data: cultureShows } = useGetTopShowsQuery({ params: { 'genre-slug': PBS_GENRES.CULTURE } });
  const { data: indieFilms } = useGetTopShowsQuery({ params: { 'genre-slug': PBS_GENRES.INDIE_FILMS } });
  const { data: scienceAndNatureShows } = useGetTopShowsQuery({ params: { 'genre-slug': PBS_GENRES.SCIENCE_AND_NATURE } });

  return (
      <div style={{ marginTop: 73 }}>
        <Banner />
        {artsAndMusicShows && <MediaRow title="Arts and Music" shows={artsAndMusicShows} />}
        {dramaShows && <MediaRow title="Drama" shows={dramaShows} />}
        {historyShows && <MediaRow title="History" shows={historyShows} />}
        {cultureShows && <MediaRow title="Culture" shows={cultureShows} />}
        {indieFilms && <MediaRow title="Indie Films" shows={indieFilms} />}
        {scienceAndNatureShows && <MediaRow title="Science and Nature" shows={scienceAndNatureShows} />}
      </div>
  )
}

export default Browse

