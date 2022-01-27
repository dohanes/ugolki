import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from'./components/game.js';
import Menu from './components/menu.js';
import Container from 'react-bootstrap/Container';

// ========================================

ReactDOM.render(
    <><Menu /><Container><Game /></Container></>,
    document.getElementById('root')
);
