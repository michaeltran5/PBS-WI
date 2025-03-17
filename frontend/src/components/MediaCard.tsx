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

    console.log('show');
    return (
        <Hover onClick={handleClick}>
            <Cover
                src={show.attributes.images?.[0]?.image || "https://image.pbs.org/video-assets/p6LbKTL-asset-mezzanine-16x9-26jA930.jpg?format=webp&resize=1720x960"}
            />
        </Hover>
    );
};