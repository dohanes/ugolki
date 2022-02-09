import Game from '../components/game.js';
import { Card, Button, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

function Online() {

    let [currentState, setCurrentState] = useState('START');
    let [color, setColor] = useState('RANDOM');
    let [type, setType] = useState('3x4');
    let [startLabel, setStartLabel] = useState('Start Game');

    let [gameUUID, setGameUUID] = useState(useParams()?.uuid || null);
    let [playingAs, setPlayingAs] = useState(null);

    let [gameState, setGameState] = useState(null);

    let [playingAgainst, setPlayingAgainst] = useState(null);

    const invited = useParams()?.uuid !== undefined;

    useEffect(() => {
        if (invited) {
            if (typeof gameUUID === 'string' && gameUUID.length === 36) {
                fetch("/api/game/get-invite-details", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ uuid: gameUUID })
                })
                    .then(res => res.json())
                    .then((data) => {
                        if (data.success) {
                            setPlayingAs(data.playingAs)
                            setPlayingAgainst(data.playingAgainst)
                            setType(data.type)
                            if (data.started) {
                                setGameState(data.state)
                                setPlayingAs(data.playingAs)
                                setPlayingAgainst(data.playingAgainst)
                                setCurrentState('PLAY')
                            } else {
                                setCurrentState('JOIN')
                            }
                        }
                    })
            }
        }
    })

    function startInvitation() {
        setStartLabel('Starting Game...')
        fetch("/api/game/create", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({color: color, type: type})
        }).then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                alert("An unknown error occurred while trying to create the game.")
            }
        }).then(data => {
            if (data.success) {
                setGameUUID(data.uuid);
                setPlayingAs(data.playingAs);
                setCurrentState('WAIT')
            } else {
                alert(data.reason)
                setStartLabel('Start Game')
            }
        })
    }

    function joinGame() {
        fetch("/api/game/join-game", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ uuid: gameUUID })
        }).then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                alert("An unknown error occurred while trying to join the game.")
            }
        }).then(data => {
            if (data.success) {
                setGameState(data.state)
                setCurrentState('PLAY')
            } else {
                alert(data.reason)
            }
        })
    }

    function startScreen() {
        return (<Card>
            <Card.Body className="text-center">
                <h3>New Online Game</h3>
                <div key="game-color-radio" className="mb-3">
                    <Form.Check
                        inline
                        label="White"
                        name="color"
                        type="radio"
                        id="game-color-radio-1"
                        onClick={() => setColor('WHITE')}
                    />
                    <Form.Check
                        inline
                        label="Black"
                        name="color"
                        type="radio"
                        id="game-color-radio-2"
                        onClick={() => setColor('BLACK')}
                    />
                    <Form.Check
                        inline
                        checked={true}
                        label="Random"
                        name="color"
                        type="radio"
                        id="game-color-radio-3"
                        onClick={() => setColor('RANDOM')}
                    />
                </div>
                <div key="game-type-radio" className="mb-3">
                    <Form.Check
                        inline
                        label="3x3"
                        name="type"
                        type="radio"
                        id="game-type-radio-1"
                        onClick={() => setType('3x3')}
                    />
                    <Form.Check
                        inline
                        checked={true}
                        label="3x4"
                        name="type"
                        type="radio"
                        id="game-type-radio-2"
                        onClick={() => setType('3x4')}
                    />
                    <Form.Check
                        inline
                        label="4x4"
                        name="type"
                        type="radio"
                        id="game-type-radio-3"
                        onClick={() => setType('4x4')}
                    />
                </div>
                <Button onClick={startInvitation} disabled={startLabel !== 'Start Game'}>{startLabel}</Button>
            </Card.Body>
        </Card>);
    }

    function waitingScreen() {
        return (<Card>
            <Card.Body className="text-center">
                <h3>Waiting for Opponent...</h3>
                <p>Invite someone to play with this link:</p>
                <code>https://ugolki.net/online/{gameUUID}</code>
                <hr/>
                <p>Playing As: {playingAs}<br/>Game Type: {type}</p>
            </Card.Body>
        </Card>);
    }

    function joinScreen() {
        return (<Card>
            <Card.Body className="text-center">
                <h3>Join Game</h3>
                <p>Playing against: {playingAgainst}<br/>Playing as: {playingAs}</p>
                <Button onClick={joinGame}>Play!</Button>
            </Card.Body>
        </Card>);
    }

    function playScreen() {
        return (<Game state={gameState} player={playingAs} />)
    }

    useEffect(() => {
        const intvl = setInterval(intvl => {
            if (currentState === 'WAIT') {
                fetch("/api/game/check-if-joined", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ uuid: gameUUID })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.joined) {
                        setGameState(data.state)
                        setPlayingAgainst(data.playingAgainst)
                        setCurrentState('PLAY')
                    }
                })
            } else if (currentState === 'PLAY') {

            }
        }, 5000)
        return () => clearInterval(intvl);
    })


    switch(currentState) {
        case 'WAIT': return waitingScreen();
        case 'PLAY': return playScreen();
        case 'JOIN': return joinScreen();
        default: return startScreen();
    }
}

export default Online;