import { Carousel } from "react-bootstrap"
import { BannerItem } from "./BannerItem";
import { useGetCarouselAssetsQuery } from "../redux/rtkQuery/customApi";
import { Asset } from "../types/Asset";
import { Container, LoadingContainer, LoadingText } from "../styled/MediaPlayer.styled";
import { ErrorText } from "../styled/EpisodeDetails.styled";

export const Banner = () => {
    const { data: assets, isLoading, error } = useGetCarouselAssetsQuery();

    if (isLoading) {
        return (
            <Container>
                <LoadingContainer>
                    <LoadingText>Loading content...</LoadingText>
                </LoadingContainer>
            </Container>
        );
    }

    if (error) {
        return <ErrorText>
            Error: {error instanceof Error ? error.message : 'An error occurred loading episode details'}
        </ErrorText>;
    }

    return (
        <Carousel style={{ marginBottom: 60 }}>
            {assets?.map((asset: Asset) => (
                <Carousel.Item key={asset.id}>
                    <BannerItem asset={asset} />
                </Carousel.Item>
            ))}
        </Carousel>
    );
}