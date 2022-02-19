import React from "react";
import { Routes, Route } from "react-router-dom";
import Menu from './components/menu.js';
import Footer from './components/footer.js';
import Container from 'react-bootstrap/Container';
import Modals from './components/modals.js';
import Home from './pages/home.js';
import Online from './pages/online.js';
import NotFound from './pages/not-found.js'
import Profile from './pages/profile.js'

function App() {
    return (<>
        <Menu />
        <br/>
        <Container>
            <Routes>
                <Route path="*" element={<NotFound />} />
                <Route path="/" element={<Home />} />
                <Route path="/online">
                    <Route path="" element={<Online />} />
                    <Route path=":uuid" element={<Online />} />
                </Route>
                <Route path="/profile">
                    <Route path="" element={<Profile />} />
                    <Route path=":username" element={<Profile />} />
                </Route>
            </Routes>
            <Footer />
        </Container>
        <Modals />
        </>);
}

export default App;