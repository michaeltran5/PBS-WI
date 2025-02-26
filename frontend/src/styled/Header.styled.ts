import styled from 'styled-components';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { LinkProps } from 'react-router-dom';

// Type definitions
type NavItemProps = {
    active?: boolean;
} & LinkProps;

// Styled Navbar component
export const StyledNavbar = styled(Navbar)`
  background-color: #2639c3; /* PBS Wisconsin blue */
  padding: 0.25rem 0; /* Reduced padding */
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 1000;
  margin-bottom: 0.5rem; /* Add a small margin at the bottom */
`;

// Styled Container component
export const StyledContainer = styled(Container)`
  padding: 0 2rem;
`;

// Main Navigation
export const MainNav = styled(Nav)`
  margin-right: auto;
  display: flex;
  align-items: center;
`;

// Navigation Item
export const NavItem = styled(Nav.Link) <NavItemProps>`
  color: white;
  font-family: 'PBS Sans', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.75rem 1.2rem; /* Reduced vertical padding */
  transition: all 0.2s ease;
  position: relative;
  text-decoration: none !important;
  
  &:hover, &:focus, &:active, &:visited {
    color: #f0f0f0;
    text-decoration: none !important;
  }
  
  ${props => props.active && `
    color: #f0f0f0;
    font-weight: 700;
  `}
`;

// Dropdown Toggle
export const DropdownToggle = styled(NavItem)`
  &::after {
    display: inline-block;
    margin-left: 0.255em;
    vertical-align: 0.255em;
    content: "";
    border-top: 0.3em solid;
    border-right: 0.3em solid transparent;
    border-bottom: 0;
    border-left: 0.3em solid transparent;
  }
`;

// Right Side Navigation
export const RightNav = styled(Nav)`
  margin-left: auto;
  display: flex;
  align-items: center;
`;

export { GlobalStyles as GlobalFontStyle } from '../GlobalStyles';

// Media queries for responsive design
export const responsiveStyles = styled.div`
  @media (max-width: 992px) {
    ${MainNav} {
      margin: 1rem 0;
    }
    
    ${NavItem} {
      padding: 0.5rem 0;
    }
  }
`;

// Add a container for the page content that sits close to the navbar
export const PageContentContainer = styled.div`
  padding-top: 0.5rem;
`;