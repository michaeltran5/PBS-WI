import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 60px;
    height: 700px;
    justify-content: center;
`;

export const ShowTitle = styled.p`
    font-size: 18px;
    color: #FFCF00;
    font-weight: 700;
`;

export const EpisodeTitle = styled.p`
    font-size: 40px;
    font-weight: 700;
`;

export const PremiereDate = styled.p`
    font-size: 18px;
    font-weight: 500;
`;

export const Description = styled.p`
    font-size: 18px;
`;

export const Top = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const Details = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const CoverImage = styled.div<{ image: string }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;;
    background-image: url(${(props) => props.image});
    background-size: cover;
    background-position: center;
`;

export const Button = styled.div`
    z-index: 1;
    padding: 18px 22px;
    background-color: #FFCF00;
    border-radius: 16px;
    width: fit-content;
    cursor: pointer;
`;

export const ButtonText = styled.p`
    color: black;
    size: 18px;
    font-weight: 600;
`;

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 270px;
    z-index: 1;
    gap: 120px;
`;