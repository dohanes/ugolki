import React from 'react';

const replaceAt = function (str, index, replacement) {
    return str.substring(0, index) + replacement + str.substring(index + replacement.length);
}

const Player = { WHITE: '1', BLACK: '2' }

const numbers = ['１', '２', '３', '４', '５', '６', '７', '８'];

class Game extends React.Component {
    constructor(props, state, turn) {
        super(props)
        if (!state || typeof state !== 'string' || state.length !== 64) {
            this.positions = "1110000011100000111000001110000000000222000002220000022200000222"
        } else {
            this.positions = state
        }

        this.validateWin();

        if (!Player[turn]) {
            this.turn = Player.WHITE
        } else {
            this.turn = Player[turn]
        }
    }

    static convertPos(x, y) {
        return (x - 1) + ((y - 1) * 8);
    }

    validateWin() {
        if (this.positions.startsWith('222000002220000022200000222')) {
            this.winner = 2;
        } else if (this.positions.endsWith('111000001110000011100000111')) {
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

            var token = this.positions[i]

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

    possible_hops(position) {
        var directions = [[position - 8, position - 16], [position + 1, position + 2], [position + 8, position + 16], [position - 1, position - 2]]

        var hoppable = [];

        for (const direction of directions) {
            if (this.positions[direction[0]] !== '0' && this.positions[direction[1]] === '0') {
                hoppable.push(direction[1])
            } else {
                hoppable.push(null)
            }
        }

        return hoppable;
    }

    move(player, from, to) {
        if (player !== this.turn) return { success: false, error: "It is not this player's turn!" }
        if (this.turn !== this.positions[from] || from > 64 || to > 64 || from < 0 || to < 0) return { success: false, error: "Invalid token position!" }
        if (from === to) return { success: false, error: "Invalid move!" }

        if (Math.abs(from - to) === 1 || Math.abs(from - to) === 8) {
            this.positions = replaceAt(this.positions, from, '0');
            this.positions = replaceAt(this.positions, to, this.turn.toString());
            this.turn = this.turn === 1 ? 2 : 1;
            return { success: true, hops: 0, win: this.validateWin() }
        }

        var visited = [];
        var unvisited = [from];

        var hops = 0;

        while (unvisited.length) {
            var newVisited = [];
            for (const pos of unvisited) {
                newVisited.push(...this.possible_hops(pos).filter(x => x !== null && !visited.includes(x)))
            }

            visited.push(...unvisited)

            unvisited = newVisited;

            if (visited.includes(to)) {
                this.positions = replaceAt(this.positions, from, '0');
                this.positions = replaceAt(this.positions, to, this.turn.toString());
                this.turn = this.turn === 1 ? 2 : 1;
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