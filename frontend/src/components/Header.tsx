import React, { useState, useEffect } from 'react';
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

const Header: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    
    //scroll effect
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);
    
    return (
        <>
            <GlobalFontStyle />
            <GlobalFontStyle />
            <StyledNavbar expand="lg" style={{ backgroundColor: scrolled ? '#2639c3' : '#000525',
                    transition: 'background-color 0.3s ease'
                }}
            >
                <StyledContainer fluid>
                    {/* PBS Wisconsin Logo */}
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center me-4" style={{ textDecoration: 'none' }}>
                        <Image
                            alt="PBS Wisconsin"
                            src="/transparent_logo.png"
                            width="82.2"
                            height="50"
                            className="d-inline-block"
                            style={{ marginTop: '5px' }}
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* Main Navigation */}
                        <MainNav className="no-underline">
                            <NavItem as={Link} to="/browse" className="no-underline">
                                Browse
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
};

export default Header;