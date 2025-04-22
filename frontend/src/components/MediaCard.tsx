// Update frontend/src/components/MediaCard.tsx

import { Cover, Hover } from "../styled/MediaCard.styled"
import { Show } from "../types/Show";
import { useNavigate } from 'react-router-dom';
import { getPreferredImage } from "../utils/images";
import DefaultImage from '../assets/default-image.png';

export type Props = {
    show: Show;
}

export const MediaCard = ({ show }: Props) => {
    const navigate = useNavigate();

    // Safety check - if show is not properly formed, render nothing
    if (!show || typeof show !== 'object') {
        console.warn('MediaCard received invalid show data');
        return null;
    }

    const handleClick = () => {
        // Debug log to see what properties are available
        console.log('Clicked on show:', show);
        
        // Check if this is a PBS asset
        if ('assetId' in show && show.assetId) {
            console.log(`Navigating to PBS asset: ${show.assetId}`);
            // For PBS assets, use the dedicated PBS route
            navigate(`/pbs/${show.assetId}`);
        } else {
            // For regular shows, determine the correct ID to use
            const id = show.showId || show.id;
            console.log(`Navigating to show: ${id}`);
            navigate(`/watch/${id}`);
        }
    };

    // Safe access to attributes
    const attributes = show.attributes || {};
    
    // Handle case where images might be undefined
    const imageUrl = attributes.images ? 
        getPreferredImage(attributes.images) : 
        DefaultImage;

    // Handle case where title might be undefined
    const title = attributes.title || "Untitled";

    return (
        <Hover onClick={handleClick}>
            <Cover
                src={imageUrl}
                alt={title}
            />
        </Hover>
    );
};