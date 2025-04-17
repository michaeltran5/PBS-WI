import { Cover, Hover } from "../styled/MediaCard.styled"
import { Show } from "../types/Show";
import { useNavigate } from 'react-router-dom';
import { getPreferredImage } from "../utils/images";


export type Props = {
    show: Show;
}
export const MediaCard = ({ show }: Props) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/watch/${show.id}`);
    };

    return (
        <Hover onClick={handleClick}>
            <Cover
                src={getPreferredImage(show.attributes.images)}
            />
        </Hover>
    );
};