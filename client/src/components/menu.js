import React from 'react';
import {Container, Nav, Navbar} from 'react-bootstrap';

class Menu extends React.Component {
    render() {
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
                        <Nav.Link href="#">Play Online</Nav.Link>
                        <Nav.Link href="#">Play Singleplayer</Nav.Link>
                        
                    </Nav>
                    <Nav>
                        <Nav.Link href="#" data-bs-toggle="modal" data-bs-target="#signInModal">Sign In</Nav.Link>
                        <Nav.Link href="#" data-bs-toggle="modal" data-bs-target="#signUpModal">Sign Up</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        );
    }
}

export default Menu;