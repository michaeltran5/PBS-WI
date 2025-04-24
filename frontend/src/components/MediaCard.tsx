import React, { useState } from 'react';
import { Cover, Hover } from "../styled/MediaCard.styled";
import { Show } from "../types/Show";
import ShowModal from "./ShowModal";
import { getPreferredImage } from "../utils/images";

export type Props = {
    show: Show;
}

export const MediaCard = ({ show }: Props) => {
    const [showModal, setShowModal] = useState(false);
    
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault(); 
        e.stopPropagation();
        setShowModal(true);
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <Hover onClick={handleClick}>
                <Cover
                    src={getPreferredImage(show.attributes.images)}
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