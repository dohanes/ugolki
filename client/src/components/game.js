import React from 'react';
import Board from './board.js';
import GameTools from 'ugolki-lib/game-tools';

class Game extends React.Component {
    constructor(props, state, turn) {
        super(props)

        this.tools = new GameTools(state, turn)

        this.state = this.tools.state;
    }

    render() {
        return <Board tiles={this.state.tiles} turn={this.state.turn} possible_moves={(pos) => this.tools.possible_moves(pos)} move={(pos1, pos2) => this.runTools(this.tools.move(this.state.turn, pos1, pos2))} toBase32={() => this.tools.stateInBase32()} winner={this.state.winner} />;
    }

    runTools(ret) {
        this.setState(this.tools.state);
        return ret;
    }
}

export default Game;