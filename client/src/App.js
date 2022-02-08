import React from "react";
import { Routes, Route } from "react-router-dom";
import Menu from './components/menu.js';
import Footer from './components/footer.js';
import Container from 'react-bootstrap/Container';
import Modals from './components/modals.js';
import Home from './pages/home.js';
import Online from './pages/online.js';

function App() {
    return (<>
        <Menu />
        <br/>
        <Container>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/online" element={<Online />} />
            </Routes>
            <Footer />
        </Container>
        <Modals />
        </>);
}

export default App;