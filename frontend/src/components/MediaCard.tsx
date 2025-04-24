import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cover, Hover } from "../styled/MediaCard.styled";
import { Show } from "../types/Show";
import ShowModal from "./ShowModal";
import { getPreferredImage } from "../utils/images";
import DefaultImage from '../assets/default-image.png';

export type Props = {
    show: Show;
}

export const MediaCard = ({ show }: Props) => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    
    if (!show || typeof show !== 'object') {
        console.warn('MediaCard received invalid show data');
        return null;
    }
    
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault(); 
        e.stopPropagation();
        
        // Check if this is a PBS asset
        if ('assetId' in show && show.assetId) {
            console.log(`Navigating to PBS asset: ${show.assetId}`);
            navigate(`/pbs/${show.assetId}`);
        } else {
            setShowModal(true);
        }
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
    };
    
    const attributes = show.attributes || {};
    
    const imageUrl = attributes.images ? 
        getPreferredImage(attributes.images) : 
        DefaultImage;
    
    const title = attributes.title || "Untitled";
    
    return (
        <>
            <Hover onClick={handleClick}>
                <Cover
                    src={imageUrl}
                    alt={title}
                />
            </Hover>
            
            <ShowModal
                showData={show}
                show={showModal}
                onHide={handleCloseModal}
            />
        </>
    );
};