import { Cover, Hover } from "../styled/MediaCard.styled"
import { Show } from "../types/Show";


export type Props = {
    show: Show;
}
export const MediaCard = ({ show }: Props) => {
    return (
        <Hover>
            <Cover
                src={show.attributes.images[0].image}
            />
        </Hover>
    );
};