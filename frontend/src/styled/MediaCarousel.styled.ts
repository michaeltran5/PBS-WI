import Carousel from "react-multi-carousel";
import styled from "styled-components";

export const Container = styled.div`
    padding-inline-end: 64px;
`;

export const StyledCarousel = styled(Carousel)`
    overflow: visible;
    left: -3px;

    .carouselItem {
        margin-right: 8px;
        width: calc(20% - 16px);

        @media screen and (max-width: 1439px) {
            width: calc(20% - 8px);
            margin-right: 4px;
        }

        @media screen and (max-width: 1023px) {
            width: calc(25% - 8px);
            margin-right: 4px;
        }

        @media screen and (max-width: 766px) {
            width: calc(50% - 8px);
            margin-right: 4px;
        }
    }
`;