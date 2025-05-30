import { ButtonText, Container, CoverImage, Description, Details, EpisodeTitle, PremiereDate, ShowTitle, Top, Button, Content } from "../styled/BannerItem.styled";
import dayjs from "dayjs";
import { Asset } from "../types/Asset";
import { getPreferredImage } from "../utils/images";
import { useNavigate } from "react-router-dom";

type Props = {
    asset: Asset;
}
export const BannerItem = ({ asset }: Props) => {
    const navigate = useNavigate();
    
    const formatDuration = (durationInSeconds: number = 0) => {
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    const handleClick = () => {
        navigate(`/watch/${asset.attributes.parent_tree?.attributes?.season?.attributes?.show?.id}`);
    };

    return (
        <Container>
            <CoverImage image={getPreferredImage(asset.attributes.images)} />
            <Content>
                <Top>
                    <ShowTitle>{asset.attributes.parent_tree?.attributes?.season?.attributes?.show?.attributes?.title?.toUpperCase()}</ShowTitle>
                    <EpisodeTitle>{asset.attributes.title}</EpisodeTitle>
                    <Details>
                        <PremiereDate>{dayjs(asset.attributes.premiered_on).format("MMM, DD YYYY")} | {formatDuration(asset.attributes.duration)}</PremiereDate>
                        <Description>{asset.attributes.description_short}</Description>
                    </Details>
                </Top>
                <Button onClick={handleClick}>
                    <ButtonText>WATCH LATEST EPISODE</ButtonText>
                </Button>
            </Content>
        </Container>
    );
}
