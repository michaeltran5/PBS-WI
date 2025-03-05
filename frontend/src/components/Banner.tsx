import { Carousel } from "react-bootstrap"
import { BannerItem } from "./BannerItem";

type Props = {
    showIds: string[];
}
export const Banner = ({ showIds }: Props) => {

    return (
        <Carousel style={{ marginBottom: 60 }}>
            {showIds.map((showId: string) => (
                <Carousel.Item key={showId}>
                    <BannerItem showId={showId} />
                </Carousel.Item>
            ))}
        </Carousel>
    );
}