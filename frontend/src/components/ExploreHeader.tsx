import { useState } from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import {NavLink} from 'react-router-dom'
import logo from '../assets/pbs_logo.png'
import '../styled/ExploreHeader.css'

function ExploreHeader() {

    return(
        <div>
            <Navbar style={{display: 'flex', alignItems: "center"}}>
                <Navbar.Brand>
                    <img
                        src={logo}
                        width={100}
                        style={{marginTop: 20, marginLeft: 30}}
                        />
                </Navbar.Brand>
                <Nav style={{paddingTop: 20}}>
                    <NavLink to="/pages/browse" style={{marginLeft: 10}} className="navbar-pages current-page">Browse</NavLink>
                    <NavLink to="/pages/live" className="navbar-pages">Live</NavLink>
                    <NavLink to="/pages/mylist" className="navbar-pages">My List</NavLink>
                    <NavLink to="/pages/browsegenre" className="navbar-pages">Browse by Genre</NavLink>
                </Nav>
            </Navbar>
        </div>
    );
}

export default ExploreHeader;