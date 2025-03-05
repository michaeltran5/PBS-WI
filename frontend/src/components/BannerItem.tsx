import { ButtonText, Container, CoverImage, Description, Details, EpisodeTitle, PremiereDate, ShowTitle, Top, Button, Content } from "../styled/BannerItem.styled";
import dayjs from "dayjs";

type Props = {
    showId: string;
}
export const BannerItem = ({ showId }: Props) => {

    const episode = {
        attributes: {
            title: "The National Mustard Museum, Mustard Glazed Pulled Pork",
            premiered_on: "2012-11-20",
            duration: 26,
            description_short: "Host Luke Zahm visits the National Mustard Museum, home to over 6,900 mustards!",
            show: {
                attributes: {
                    title: "Wisconsin Foodie"
                }
            },
            images: [
                {
                    image: "https://image.pbs.org/video-assets/dXJBIqg-asset-mezzanine-16x9-CZHOWwy.png?format=webp&resize=1920x1080",
                    profile: "cover"
                }
            ]
        }
    }

    if (!episode) return;

    return (
        <Container>
            <CoverImage image={episode.attributes.images[0].image} />
            <Content>
                <Top>
                    <ShowTitle>{episode.attributes.show.attributes.title.toUpperCase()}</ShowTitle>
                    <EpisodeTitle>{episode.attributes.title}</EpisodeTitle>
                    <Details>
                        <PremiereDate>{dayjs(episode.attributes.premiered_on).format("MMM, DD, YYYY")} | {episode.attributes.duration}m</PremiereDate>
                        <Description>{episode.attributes.description_short}</Description>
                    </Details>
                </Top>
                <Button>
                    <ButtonText>WATCH LATEST EPISODE</ButtonText>
                </Button>
            </Content>
        </Container>
    );
}
