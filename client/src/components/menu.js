import React, {useState, useEffect} from 'react';
import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import { useLocation } from "react-router-dom";

function Menu() {

    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        fetch("/api/account/get-data", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        .then(res => res.json())
        .then((data) => {
            if (data.loggedIn) {
                setLoggedIn(true)
                setUsername(data.username)
            }
        })
    })

    function logOut() {
        fetch("/api/account/log-out", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(res => {
            if (res.status === 200) {
                window.location.reload(false);
            } else {
                alert("An unknown error occurred while trying to log you out.")
            }
        })
    }

    function notLoggedInLinks() {
        return (<Nav>
            <Nav.Link href="#" data-bs-toggle="modal" data-bs-target="#signInModal">Sign In</Nav.Link>
            <Nav.Link href="#" data-bs-toggle="modal" data-bs-target="#signUpModal">Sign Up</Nav.Link>
        </Nav>);
    }

    function loggedInLinks() {
        return (<Nav><NavDropdown title={username} id="basic-nav-dropdown">
            <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
            <NavDropdown.Item href="/history">Game History</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#" onClick={logOut}>Log Out</NavDropdown.Item>
        </NavDropdown></Nav>)
    }

    const location = useLocation().pathname;

    return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
        <Container>
                <Navbar.Brand href="#home">
                    <img
                        alt=""
                        src="/logo192.png"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '}
                    Ugolki.net
                </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/" className={location === '/' ? 'active' : ''}>Play Singleplayer</Nav.Link>
                    <Nav.Link href="/online" className={location === '/online' ? 'active' : ''}>Play Online</Nav.Link>
                </Nav>
                {(loggedIn ? loggedInLinks() : notLoggedInLinks())}
            </Navbar.Collapse>
        </Container>
    </Navbar>
    );
}

export default Menu;