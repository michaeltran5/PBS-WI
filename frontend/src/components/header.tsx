import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image';
import { Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';

function Header() {
    return (

        <Navbar style={{ backgroundColor: 'transparent', position: 'absolute', width: '100%', zIndex: 1000 }}>
            {/* Navbar component ^ */}
            <Container>
                <Navbar.Brand href="#home" className="d-flex align-items-center text-white me-4">
                    {/* This holds the PBS logo */}
                    <Image
                        alt=""
                        src="/transparent_logo.png"
                        width="75"
                        height="50"
                        className="d-inline-block"
                    />
                </Navbar.Brand>
                <Nav className="me-auto">
                    {/* This holds all the different redirection links, will have to redo with actual link names */}
                    <Nav.Link as={Link} to="/" className="text-white fw-bold me-4">Browse</Nav.Link>
                    <Nav.Link href="#live" className="text-white me-4">Live</Nav.Link>
                    <Nav.Link href="#mylist" className="text-white me-4">My List</Nav.Link>
                    <Nav.Link href="#genre" className="text-white me-4">Browse by Genre</Nav.Link>
                </Nav>
                <Nav>
                    {/* This Nav tag holds the search and profile photo, both search and user icon imported through lucide */}
                    <Nav.Link href="#search" className="text-white me-4">
                        <Search size={24} />
                    </Nav.Link>
                    <Nav.Link href="#profile" className="text-white">
                        <User size={32} color="white" />
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default Header;