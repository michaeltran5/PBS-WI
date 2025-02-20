import React from 'react';
import {Navbar, Nav, Container} from 'react-bootstrap';
import logo from '../assets/pbs_logo.png'
import '../styled/ExploreHeader.css'

function ExploreHeader() {
    return(
        <div>
            <Navbar bg="dark" variant="dark">
                <Container style={{display: 'flex', alignItems: "center"}}>
                    <Navbar.Brand>
                        <img
                            src={logo}
                            width={100}
                            style={{marginTop: 20, marginLeft: 30}}
                            />
                    </Navbar.Brand>
                    <Nav style={{paddingTop: 20}}>
                        <Nav.Link className="navbar-pages current-page">Browse</Nav.Link>
                        <Nav.Link className="navbar-pages">Live</Nav.Link>
                        <Nav.Link className="navbar-pages">My List</Nav.Link>
                        <Nav.Link className="navbar-pages">Browse by Genre</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </div>
    );
}

export default ExploreHeader;