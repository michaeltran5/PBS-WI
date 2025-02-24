import { Cover, Hover } from "../styled/MediaCard.styled"


export type Props = {
    src: string;
}
export const MediaCard = ({ src }: Props) => {
    return (
        <Hover>
            <Cover
                src={src}
            />
        </Hover>
    );
};