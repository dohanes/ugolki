import React from 'react';
import Board from './board.js';
import GameTools from 'ugolki-lib/game-tools';
import { Card, Row, Col } from 'react-bootstrap';

class Game extends React.Component {
    constructor(props) {
        super(props)

        const {state, turn, pun} = props;

        this.tools = new GameTools(state, turn, pun || undefined)

        this.state = this.tools.state;
    }

    

    render() {

        if (this.props.state !== undefined) {
            this.tools.setState({ tiles: this.props.state })
        }
        if (this.props.turn !== undefined) {
            this.tools.setState({ turn: this.props.turn })
        }
        if (this.props.pun !== undefined) {
            this.tools.setState({ pun: this.props.pun })
        }
        

        return (
            <Card>
                <Card.Body>
                    <Row>
                        <Col>
                            <Board tiles={this.state.tiles} turn={this.state.turn} possible_moves={(pos) => this.tools.possible_moves(pos)} move={(pos1, pos2) => this.runTools(this.tools.move(this.state.turn, pos1, pos2))} toBase32={() => this.tools.stateInBase32()} winner={this.state.winner} player={this.props.player} uuid={this.props.uuid} />
                        </Col>
                        <Col>
                            <p>Current Turn: {this.state.turn === '1' ? 'White' : 'Black'}<br />Winner: {this.state.winner === '0' ? 'None' : this.state.winner === '1' ? 'White' : 'Black'}</p><p>USN: <code>{this.state.tiles}</code><br/>Mini-USN: <code>{this.tools.stateInBase32()}</code><br/>PUN: <code>{this.state.pun}</code></p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        );
    }

    runTools(ret) {
        this.setState(this.tools.state);
        return ret;
    }
}

export default Game;