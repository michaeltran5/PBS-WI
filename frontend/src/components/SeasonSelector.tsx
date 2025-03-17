import React from 'react';
import { Container, SeasonSelect} from '../styled/SeasonSelector.styled';

interface SeasonSelectorProps {
  seasons: number[];
  selectedSeason: number | null;
  onSeasonChange: (season: number) => void;
}

const SeasonSelector: React.FC<SeasonSelectorProps> = ({
  seasons, selectedSeason, onSeasonChange }) => {
  if (seasons.length <= 1) {
    return null;
  }

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