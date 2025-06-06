// Update frontend/src/components/MediaCarousel.tsx

import { MediaCard } from "./MediaCard";
import 'react-multi-carousel/lib/styles.css';
import { Container, StyledCarousel } from "../styled/MediaCarousel.styled";
import { Show } from "../types/Show";


export type Props = {
    shows: Show[];
}
export const MediaCarousel = ({ shows }: Props) => {
    // Safety check for invalid shows array
    if (!shows || !Array.isArray(shows)) {
        console.warn('MediaCarousel received invalid shows data:', shows);
        return null;
    }

    // Filter out any invalid shows
    const validShows = shows.filter(show => show && show.id);

    const responsive = {
        largeDesktop: {
            breakpoint: { max: Number.MAX_SAFE_INTEGER, min: 1440 },
            items: 5.5,
            slidesToSlide: 5.5,
            partialVisibilityGutter: 10
        },
        desktop: {
            breakpoint: { max: 1439, min: 1024 },
            items: 5.5,
            slidesToSlide: 5,
            partialVisibilityGutter: 10
        },
        tablet: {
            breakpoint: { max: 1023, min: 767 },
            items: 4,
            slidesToSlide: 4,
            partialVisibilityGutter: 10
        },
        smallTablet: {
            breakpoint: { max: 766, min: 464 },
            items: 2,
            slidesToSlide: 2,
            partialVisibilityGutter: 10
        },
        mobile: {
            breakpoint: { max: 463, min: 0 },
            items: 2,
            slidesToSlide: 2,
            partialVisibilityGutter: 10
        }
    };

    // If no valid shows, don't render the carousel
    if (validShows.length === 0) {
        return null;
    }

    return (
        <Container>
            <StyledCarousel
                responsive={responsive}
                itemClass="carouselItem"
            >
                {validShows.map(show => (
                    <MediaCard key={`show-${show.id}`} show={show} />
                ))}
            </StyledCarousel>
        </Container>
    );
};