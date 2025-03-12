import { Carousel } from "react-bootstrap"
import { BannerItem } from "./BannerItem";
import { useGetCarouselAssetsQuery } from "../redux/rtkQuery/pbsWiApi";
import { Asset } from "../types/Asset";

export const Banner = () => {
    const { data: assets, isLoading, isError } = useGetCarouselAssetsQuery();

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