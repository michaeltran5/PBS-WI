import styled from "styled-components";

export const Cover = styled.img`
    aspect-ratio: 1.78;
    width: 100%;
    border-radius: 6px;
`;

export const Hover = styled.a`
    display: inline-block;
    transition: transform 0.3s ease-in-out, border 0.3s ease-in-out;
    border: 3px solid transparent;
    border-radius: 6px;
    overflow: hidden;

    &:hover {
        transform: scale(1.05);
        border: 3px solid white;
    }
`;