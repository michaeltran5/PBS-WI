import React from 'react';
import { Navbar, Image } from 'react-bootstrap';
import { Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    StyledNavbar,
    StyledContainer,
    MainNav,
    NavItem,
    RightNav,
    GlobalFontStyle
} from '../styled/Header.styled';

function Header() {
    return (
        <>
            <GlobalFontStyle />
            <StyledNavbar expand="lg">
                <StyledContainer fluid>
                    {/* PBS Wisconsin Logo */}
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center me-4" style={{ textDecoration: 'none' }}>
                        <Image
                            alt="PBS Wisconsin"
                            src="/transparent_logo.png"
                            width="82.2"
                            height="50"
                            className="d-inline-block"
                        />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* Main Navigation */}
                        <MainNav className="no-underline">
                            <NavItem as={Link} to="/browse" className="no-underline">
                                Browse
                            </NavItem>
                            <NavItem as={Link} to="/watch" className="no-underline">
                                Watch
                            </NavItem>
                            <NavItem as={Link} to="/live" className="no-underline">
                                Live
                            </NavItem>
                            <NavItem as={Link} to="/my-list" className="no-underline">
                                My List
                            </NavItem>
                            <NavItem as={Link} to="/browse-by-genre" className="no-underline">
                                Browse by Genre
                            </NavItem>
                        </MainNav>

                        {/* Right Side Navigation */}
                        <RightNav>
                            <NavItem as={Link} to="/search" className="no-underline">
                                <Search size={20} />
                            </NavItem>
                            <NavItem as={Link} to="/profile" className="no-underline">
                                <User size={20} />
                            </NavItem>
                        </RightNav>
                    </Navbar.Collapse>
                </StyledContainer>
            </StyledNavbar>
        </>
    );
}

export default Header;