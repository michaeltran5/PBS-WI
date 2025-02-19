import React from 'react';
import {Navbar, Container} from 'react-bootstrap';

function ExploreHeader() {
    return(
        <div>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand>
                    {' '}PBS Wisconsin
                    </Navbar.Brand>
                </Container>
            </Navbar>
        </div>
    );
}

export default ExploreHeader;