import { Container, SeasonSelect} from '../styled/SeasonSelector.styled';

type Props = {
  seasonsCount: number;
  selectedSeason?: number;
  onSeasonChange: (season: number) => void;
}

const SeasonSelector = ({ seasonsCount, selectedSeason, onSeasonChange}: Props)  => {
  if (seasonsCount < 1) {
    return null;
  }

  const seasons = Array.from({ length: seasonsCount }, (_, i) => i + 1);

  return (
    <Container>
      <SeasonSelect value={selectedSeason || ''} onChange={(e) => onSeasonChange(Number(e.target.value))}>
        {seasons.map((season) => (
          <option key={season} value={season}>
            Season {season}
          </option>
        ))}
      </SeasonSelect>
    </Container>
  );
};

export default SeasonSelector;