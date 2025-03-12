import { Container, Title } from "../styled/MediaRow.styled";
import { Show } from "../types/Show";
import { MediaCarousel } from "./MediaCarousel";

export type Props = {
    title: string;
    shows: Show[];
}
export const MediaRow = ({ title, shows }: Props) => {
    return (
        <Container>
            <Title>{title}</Title>
            <MediaCarousel shows={shows} />
        </Container>
    );
};