import Game from '../components/game.js';
import { Card, Button, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

function Online() {

    let [currentState, setCurrentState] = useState('');
    let [color, setColor] = useState('RANDOM');
    let [type, setType] = useState('3x4');
    let [startLabel, setStartLabel] = useState('Start Game');

    let [gameUUID, setGameUUID] = useState(useParams()?.uuid || null);
    let [playingAs, setPlayingAs] = useState(null);
    let [gamePUN, setGamePUN] = useState(null);

    let [gameState, setGameState] = useState(null);
    let [gameTurn, setGameTurn] = useState('1');
    let [gameWinner, setGameWinner] = useState('0');

    let [playingAgainst, setPlayingAgainst] = useState(null);

    let [activeGames, setActiveGames] = useState([]);

    const invited = useParams()?.uuid !== undefined;

    useEffect(() => {
        fetch("/api/game/get-active", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then((data) => {
            if (data.success) {
                setActiveGames(data.games)
            }
        })
    }, [])

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
                                setGamePUN(data.pun)
                                setGameTurn(data.turn)
                                setGameWinner(data.winner)
                                setCurrentState('PLAY')
                            } else {
                                setCurrentState('JOIN')
                            }
                        }
                    })
            }
        } else {
            setCurrentState('START')
        }
    }, [gameUUID, invited])

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
        return (<><Card>
            <Card.Body className="text-center">
                <h3>New Online Game</h3>
                <div key="game-color-radio" className="mb-3">
                    <Form.Check
                        inline
                        label="White"
                        checked={color === 'WHITE'}
                        name="color"
                        type="radio"
                        id="game-color-radio-1"
                        onClick={() => setColor('WHITE')}
                    />
                    <Form.Check
                        inline
                        label="Black"
                        checked={color === 'BLACK'}
                        name="color"
                        type="radio"
                        id="game-color-radio-2"
                        onClick={() => setColor('BLACK')}
                    />
                    <Form.Check
                        inline
                        checked={color === 'RANDOM'}
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
                        checked={type === '3x3'}
                        name="type"
                        type="radio"
                        id="game-type-radio-1"
                        onClick={() => setType('3x3')}
                    />
                    <Form.Check
                        inline
                        checked={type === '3x4'}
                        label="3x4"
                        name="type"
                        type="radio"
                        id="game-type-radio-2"
                        onClick={() => setType('3x4')}
                    />
                    <Form.Check
                        inline
                        label="4x4"
                        checked={type === '4x4'}
                        name="type"
                        type="radio"
                        id="game-type-radio-3"
                        onClick={() => setType('4x4')}
                    />
                </div>
                <Button onClick={startInvitation} disabled={startLabel !== 'Start Game'}>{startLabel}</Button>
            </Card.Body>
        </Card>
        <br/>
        <Card>
            <Card.Body>
                <h4>Active Games</h4>
                {!activeGames.length ? <p>No active games! Why not start one?</p> : activeGames.map(game => <Card><Card.Body><b>Game with {game.opponent}</b> [{game.yourTurn ? 'Your Turn' : game.opponent + "'s Turn"}] <i className="text-muted">(Started {(new Date(game.started).toString())})</i><Button href={"/online/"+game.uuid} className="float-end" size="sm">Play</Button></Card.Body></Card>)}
            </Card.Body>
        </Card>
        <br/>
        <Card>
            <Card.Body>
                <h4>Game History</h4>
                <a href="/history">View your game history here.</a>
            </Card.Body>
        </Card>
        </>);
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

    useEffect(() => {
        const intvl = setInterval(() => {
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
            }
        }, 2500)
        return () => clearInterval(intvl);
    })


    switch(currentState) {
        case 'WAIT': return waitingScreen();
        case 'PLAY': return (<Game state={gameState} turn={gameTurn} player={playingAs} uuid={gameUUID} pun={gamePUN} winner={gameWinner === '0' ? undefined : gameWinner} />);
        case 'JOIN': return joinScreen();
        case 'START': return startScreen();
        default: return (<Card className="text-center"><Card.Body><h5>Loading...</h5></Card.Body></Card>);
    }
}

export default Online;