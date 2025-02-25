import { Container, Title } from "../styled/MediaRow.styled";
import { MediaCarousel } from "./MediaCarousel";

export type Props = {
    title: string;
    items: string[];
}
export const MediaRow = ({ title, items }: Props) => {
    return (
        <Container>
            <Title>{title}</Title>
            <MediaCarousel items={items} />
        </Container>
    );
};