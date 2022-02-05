import React from 'react';
import Board from './board.js';
import GameTools from 'ugolki-lib/game-tools';
import { Card, Row, Col } from 'react-bootstrap';

class Game extends React.Component {
    constructor(props, state, turn) {
        super(props)

        this.tools = new GameTools(state, turn)

        this.state = this.tools.state;
    }

    

    render() {
        return (
            <Card>
                <Row>
                    <Col>
                        <Board tiles={this.state.tiles} turn={this.state.turn} possible_moves={(pos) => this.tools.possible_moves(pos)} move={(pos1, pos2) => this.runTools(this.tools.move(this.state.turn, pos1, pos2))} toBase32={() => this.tools.stateInBase32()} winner={this.state.winner} />
                    </Col>
                    <Col>
                        <p>State: {this.state.tiles}</p><p>Game ID: {this.tools.stateInBase32()}</p> <p>Current Turn: {this.state.turn === '1' ? 'White' : 'Black'}</p> <p>Winner: {this.state.winner === '0' ? 'None' : this.state.winner === '1' ? 'White' : 'Black'}<br />PUN: {this.state.pun}</p>
                    </Col>
                </Row>
            </Card>
        );
    }

    runTools(ret) {
        this.setState(this.tools.state);
        return ret;
    }
}

export default Game;