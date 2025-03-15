import { Cover, Hover } from "../styled/MediaCard.styled"
import { Show } from "../types/Show";
import { useNavigate } from 'react-router-dom';


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
                src={show.attributes.images[0].image}
            />
        </Hover>
    );
};