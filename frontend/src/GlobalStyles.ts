import { createGlobalStyle } from "styled-components";
import PBSSans from './fonts/PBS Sans/PBSSans.ttf';
import PBSSansBlack from './fonts/PBS Sans/PBSSansBlack.ttf';
import PBSSansBold from './fonts/PBS Sans/PBSSansBold.ttf';
import PBSSansMedium from './fonts/PBS Sans/PBSSansMedium.ttf';
import PBSSansLight from './fonts/PBS Sans/PBSSansLight.ttf';

export const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'PBS Sans';
    src: url(${PBSSans}) format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'PBS Sans';
    src: url(${PBSSansBlack}) format('truetype');
    font-weight: 900;
    font-style: normal;
  }

  @font-face {
    font-family: 'PBS Sans';
    src: url(${PBSSansBold}) format('truetype');
    font-weight: 700;
    font-style: normal;
  }

  @font-face {
    font-family: 'PBS Sans';
    src: url(${PBSSansMedium}) format('truetype');
    font-weight: 500;
    font-style: normal;
  }
  
  @font-face {
    font-family: 'PBS Sans';
    src: url(${PBSSansLight}) format('truetype');
    font-weight: 400;
    font-style: normal;
  }

  body {
    background-color: #000525;
    color: white;
    font-family: 'PBS Sans', sans-serif;
    margin: 0;
    padding: 0;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'PBS Sans', sans-serif;
  }

  h1 {

  }

  h2 {
    font-weight: 700;
  }

  p {

  }
`;
