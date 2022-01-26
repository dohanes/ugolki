import React from 'react';
import Board from './board.js';

const replaceAt = function (str, index, replacement) {
    return str.substring(0, index) + replacement + str.substring(index + replacement.length);
}

const Player = { WHITE: '1', BLACK: '2' }

const numbers = ['１', '２', '３', '４', '５', '６', '７', '８'];

class Game extends React.Component {
    constructor(props, state, turn) {
        super(props)

        let s = {};
        if (!Game.validateState(state)) {
            s.tiles = Game.generateState()
        } else {
            s.tiles = state
        }

        if (!Player[turn]) {
            s.turn = Player.WHITE
        } else {
            s.turn = Player[turn]
        }

        this.state = s;

        this.validateWin();
    }

    render() {
        return <Board tiles={this.state.tiles} turn={this.state.turn} />;
    }

    static convertPos(x, y) {
        return (x - 1) + ((y - 1) * 8);
    }

    static validateState(state) {
        if (!state || typeof state !== 'string' || state.length !== 64) {
            return false;
        }

        var whiteTokens = (state.match(/1/g) || []).length;
        var blackTokens = (state.match(/2/g) || []).length;

        if (whiteTokens !== blackTokens || (whiteTokens !== 9 && whiteTokens !== 12 && whiteTokens !== 16)) {
            return false;
        }

        return true;
    }

    static generateState(homeWidth, homeHeight) {
        var state = "";
        if ((homeWidth !== 3 && homeWidth !== 4) || (homeHeight !== 3 && homeHeight !== 4)) {
            homeWidth = 3;
            homeHeight = 4;
        }

        for (var i = 0; i < 8; i++) {
            if (i < homeHeight) {
                state += '1'.repeat(homeWidth) + '0'.repeat(8 - homeWidth)
            } else if ((i === 3 || i === 4) && homeHeight === 3) {
                state += '0'.repeat(8)
            } else {
                state += '0'.repeat(8 - homeWidth) + '2'.repeat(homeWidth)
            }
        }

        return state;
    }

    stateInBase32() {
        return parseInt(this.state.tiles, 3).toString(32)
    }

    validateWin() {
        if (this.state.tiles.startsWith('222000002220000022200000222')) {
            this.winner = 2;
        } else if (this.state.tiles.endsWith('111000001110000011100000111')) {
            this.winner = 1;
        } else {
            this.winner = 0;
        }

        return this.winner;
    }

    print() {
        var msg = numbers.join("");
        for (var i = 0; i < 64; i++) {
            if (i % 8 === 0) msg += "\n"

            var token = this.state.tiles[i]

            switch (token) {
                case "0":
                    msg += "  "
                    break;
                case "1":
                    msg += "Ｗ"
                    break;
                case "2":
                    msg += "Ｂ"
                    break;
                default:
                    //do nothing
                    break;
            }
        }

        return msg.split("\n").map((x, index) => (index ? numbers[index - 1] : "  ") + " " + x).join("\n");
    }

    #possible_hops(position) {
        var directions = [[position - 8, position - 16], [position + 1, position + 2], [position + 8, position + 16], [position - 1, position - 2]]

        var hoppable = [];

        for (const direction of directions) {
            if (this.state.tiles[direction[0]] !== '0' && this.state.tiles[direction[1]] === '0') {
                hoppable.push(direction[1])
            } else {
                hoppable.push(null)
            }
        }

        return hoppable;
    }

    move(player, from, to) {
        if (player !== this.state.turn) return { success: false, error: "It is not this player's turn!" }
        if (this.state.turn !== this.state.tiles[from] || from > 64 || to > 64 || from < 0 || to < 0) return { success: false, error: "Invalid token position!" }
        if (from === to) return { success: false, error: "Invalid move!" }

        if (Math.abs(from - to) === 1 || Math.abs(from - to) === 8) {
            let tiles = this.state.tiles.slice();
            tiles = replaceAt(this.state.tiles, from, '0');
            tiles = replaceAt(this.state.tiles, to, this.state.turn.toString());
            this.setState({ tiles: tiles, turn: this.state.turn === 1 ? 2 : 1 })
            return { success: true, hops: 0, win: this.validateWin() }
        }

        var visited = [];
        var unvisited = [from];

        var hops = 0;

        while (unvisited.length) {
            var newVisited = [];
            for (const pos of unvisited) {
                newVisited.push(...this.#possible_hops(pos).filter(x => x !== null && !visited.includes(x)))
            }

            visited.push(...unvisited)

            unvisited = newVisited;

            if (visited.includes(to)) {
                let tiles = this.state.tiles.slice();
                tiles = replaceAt(this.state.tiles, from, '0');
                tiles = replaceAt(this.state.tiles, to, this.state.turn.toString());
                this.setState({ tiles: tiles, turn: this.state.turn === 1 ? 2 : 1 })
                return { success: true, hops: hops, win: this.validateWin() }
            }

            hops++;
        }

        return { success: false, error: "Invalid move!" }
    }

    mv(player, x1, y1, x2, y2) {
        return this.move(Player[player === 'w' ? 'WHITE' : 'BLACK'], Game.convertPos(x1, y1), Game.convertPos(x2, y2))
    }
}

export default Game;