import Game from '../components/game.js';
import { Card, Button } from 'react-bootstrap';
import { useState } from 'react';

let currentState, setCurrentState;

function startInvitation() {
    setCurrentState('WAIT')
}

function startScreen() {
    return (<Card>
        <Card.Body className="text-center">
            <Button onClick={startInvitation}>Start Game</Button>
        </Card.Body>
    </Card>);
}

function waitingScreen() {
    return (<Card>
        <Card.Body className="text-center">
            <h3>Waiting for Opponent...</h3>
            <p></p>
        </Card.Body>
    </Card>);
}

function Online() {
    [currentState, setCurrentState] = useState('START');

    switch(currentState) {
        case 'WAIT': return waitingScreen();
        case 'PLAY': return (<Game />);
        default: return startScreen();
    }
}

export default Online;