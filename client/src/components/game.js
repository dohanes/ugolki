import React from 'react';
import Board from './board.js';
import GameTools from 'ugolki-lib/game-tools';
import { Card, Row, Col, Button } from 'react-bootstrap';

class Game extends React.Component {
    constructor(props) {
        super(props);

        const { state, turn, pun, winner } = props;

        this.tools = new GameTools(state, turn, pun || undefined, winner || undefined)

        this.state = { resigning: false, tiles: this.tools.tiles, turn: this.tools.turn, winner: this.tools.winner, pun: this.tools.pun }
    }

    async componentDidMount() {
        if (this.props.player) {
            this.moveInterval = setInterval(() => {
                fetch('/api/game/get-status', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ uuid: this.props.uuid })
                })
                .then(res => res.json())
                .then(data => {
                    if (this.tools.winner !== data.winner || data.state !== this.tools.tiles) {
                        this.tools.winner = data.winner;
                        this.tools.tiles = data.state
                        this.tools.pun = data.pun
                        this.tools.turn = data.turn
                        this.runTools()
                    }
                    
                })
            }, 2500)
        }
    }

    async componentWillUnmount() {
        clearInterval(this.moveInterval)
    }

    resign() {
        fetch("/api/game/resign", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ uuid: this.props.uuid })
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                this.setToolsParam({winner: this.props.player === 'WHITE' ? '2' : '1'})
                this.setState({resigning: false})
            } else {
                alert(data.reason)
            }
        })
    }

    multiplayerControls() {
        if (this.props.player !== undefined && this.props.player !== 'NONE' && this.state.winner === '0') {
            return (<>
                <Button variant="danger" onClick={() => this.setState({ resigning: !this.state.resigning })}>Resign</Button>
                {this.state.resigning ? <Card>
                    <Card.Body>
                        <p>Are you sure you want to resign?</p>
                        <Button variant="danger" size="sm" onClick={() => { this.resign() }}>Resign!</Button>{' '}
                        <Button variant="secondary" size="sm" onClick={() => this.setState({resigning: false})}>Never mind</Button>
                    </Card.Body>
                </Card> : ''}
            </>)
        }
    }

    

    render() {

        return (
            <Card>
                <Card.Body>
                    <Row>
                        <Col>
                            <Board tiles={this.state.tiles} turn={this.state.turn} possible_moves={(pos) => this.tools.possible_moves(pos)} move={(pos1, pos2) => this.runTools(this.tools.move(this.state.turn, pos1, pos2))} toBase32={() => this.tools.stateInBase32()} winner={this.state.winner} player={this.props.player} uuid={this.props.uuid} />
                        </Col>
                        <Col>
                            <p>Current Turn: {this.state.turn === '1' ? 'White' : 'Black'}<br />Winner: {this.state.winner === '0' ? 'None' : this.state.winner === '1' ? 'White' : 'Black'}</p><p>USN: <code>{this.state.tiles}</code><br/>Mini-USN: <code>{this.tools.stateInBase32()}</code><br/>PUN: <code>{this.state.pun}</code></p>{this.multiplayerControls()}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        );
    }

    runTools(ret) {
        this.setState({ tiles: this.tools.tiles, turn: this.tools.turn, winner: this.tools.winner, pun: this.tools.pun })
        return ret;
    }
}

export default Game;