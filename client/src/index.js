import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from'./components/game.js';
import Menu from './components/menu.js';
import Footer from './components/footer.js';
import Container from 'react-bootstrap/Container';
import Modals from './components/modals.js';

// ========================================

ReactDOM.render(
    <><Menu /><Container><Game /><Footer /></Container><Modals /></>,
    document.getElementById('root')
);
