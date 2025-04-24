// Update frontend/src/components/MediaRow.tsx

import { Container, Title } from "../styled/MediaRow.styled";
import { Show } from "../types/Show";
import { MediaCarousel } from "./MediaCarousel";

export type Props = {
    title: string;
    shows: Show[];
}

export const MediaRow = ({ title, shows }: Props) => {
    // Add validation and debugging
    if (!shows || !Array.isArray(shows)) {
        console.warn(`MediaRow "${title}" received invalid shows data:`, shows);
        return null;
    }

    // Filter out any invalid shows (should have id and attributes at minimum)
    const validShows = shows.filter(show => show && show.id && show.attributes);
    
    console.log(`MediaRow "${title}" received ${shows.length} shows, ${validShows.length} valid`);
    
    // Don't render if no valid shows
    if (validShows.length === 0) {
        return null;
    }

    // Set a consistent margin-bottom to maintain spacing between rows
    return (
        <Container style={{ marginBottom: '60px' }}>
            <Title>{title}</Title>
            <MediaCarousel shows={validShows} />
        </Container>
    );
};