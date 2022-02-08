import PUN from './pun.js';
import Coordinates from './coordinates.js';

const corners = [
    {
        count: 9,
        left: [0, 1, 2].flatMap(x => [0 + (x * 8), 1 + (x * 8), 2 + (x * 8)]),
        right: [0, 1, 2].flatMap(x => [0 + (x * 8), 1 + (x * 8), 2 + (x * 8)]).map(x => 63 - x)
    },
    {
        count: 12,
        left: [0, 1, 2, 3].flatMap(x => [0 + (x * 8), 1 + (x * 8), 2 + (x * 8)]),
        right: [0, 1, 2, 3].flatMap(x => [0 + (x * 8), 1 + (x * 8), 2 + (x * 8)]).map(x => 63 - x)
    },
    {
        count: 16,
        left: [0, 1, 2, 3].flatMap(x => [0 + (x * 8), 1 + (x * 8), 2 + (x * 8), 3 + (x * 8)]),
        right: [0, 1, 2, 3].flatMap(x => [0 + (x * 8), 1 + (x * 8), 2 + (x * 8), 3 + (x * 8)]).map(x => 63 - x)
    }
]

function possible_hops(tiles, position) {
    var dirs = ['l', 'r', 'u', 'd'];

    var directions = [];
    dirs.forEach(dir => {
        var positions = [GameTools.goTo(dir, position, 1), GameTools.goTo(dir, position, 2)]
        if (!positions.includes(null)) {
            directions.push(positions)
        }
    })

    var hoppable = [];

    for (const direction of directions) {
        if (tiles[direction[0]] !== '0' && tiles[direction[1]] === '0') {
            hoppable.push(direction[1])
        } else {
            hoppable.push(null)
        }
    }

    return hoppable;
}

export function validateMove(tiles, turn, player, from, to) {
    if (player !== turn) return { success: false, error: "It is not this player's turn!" }
    if (turn !== tiles[from] || from > 64 || to > 64 || from < 0 || to < 0) return { success: false, error: "Invalid token position!" }
    if (from === to) return { success: false, error: "Invalid move!" }

    if (Math.abs(from - to) === 1 || Math.abs(from - to) === 8) {
        let t = tiles.slice();
        t = replaceAt(t, from, '0');
        t = replaceAt(t, to, turn.toString());
        return { tiles: t, turn: turn === '1' ? '2' : '1', success: true, hops: 0 }
    }

    var visited = [];
    var unvisited = [from];

    var hops = 0;

    while (unvisited.length) {
        var newVisited = [];
        for (const pos of unvisited) {
            newVisited.push(...possible_hops(tiles, pos).filter(x => x !== null && !visited.includes(x)))
        }

        visited.push(...unvisited)

        unvisited = newVisited;

        if (visited.includes(to)) {
            let t = tiles.slice();
            t = replaceAt(t, from, '0');
            t = replaceAt(t, to, turn.toString());
            return { tiles: t, turn: turn === '1' ? '2' : '1', success: true, hops: hops }
        }

        hops++;
    }

    return { success: false, error: "Invalid move!" }
}

export const Player = { WHITE: '1', BLACK: '2' }

const numbers = ['１', '２', '３', '４', '５', '６', '７', '８'];

const replaceAt = function (str, index, replacement) {
    return str.substring(0, index) + replacement + str.substring(index + replacement.length);
}

export default class GameTools {
    constructor(state, turn, pun) {
        let s = {};
        if (!GameTools.validateState(state)) {
            s.tiles = GameTools.generateState()
        } else {
            s.tiles = state
        }

        if (!Player[turn]) {
            s.turn = Player.WHITE
        } else {
            s.turn = Player[turn]
        }

        this.gameType = GameTools.gameType(s.tiles);

        if (!pun || !PUN.isValid(pun)) {
            s.pun = this.gameType + '>';
            this.moves = [];
        } else {
            s.pun = pun;
            this.moves = PUN.getMoves(pun);
        }

        s.winner = this.validateWin(false, s.tiles);

        this.state = s;
    }

    getTiles() {
        return this.state.tiles;
    }

    getWinner() {
        return this.state.winner;
    }

    getTurn() {
        return this.state.turn;
    }

    static goTo(direction, pos, times) {
        var coords = Coordinates.convertCoords(pos);

        switch (direction.toLowerCase()[0]) {
            case 'l':
                coords[0] -= times;
                break;
            case 'r':
                coords[0] += times;
                break;
            case 'u':
                coords[1] -= times;
                break;
            case 'd':
                coords[1] += times;
                break;
            default:
                return null;
        }

        return Coordinates.convertPos(...coords);
    }

    setState(newState) {
        for(const [k, v] of Object.entries(newState)) {
            this.state[k] = v;
        }
    }

    static gameType(state) {
        var tokens = (state.match(/1/g) || []).length;
        switch(tokens) {
            case 9:
                return '3x3';
            case 12:
                return '3x4';
            case 16:
                return '4x4';
            default:
                return null;
        }
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
        if ((homeWidth !== 3 && homeWidth !== 4) || (homeHeight !== 3 && homeHeight !== 4) || (homeHeight === 3 && homeWidth === 4)) {
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

    validateWin(edit, state) {
        let tiles = state || this.state.tiles;
        let tokens = (tiles.match(/1/g) || []).length;
        let corner = corners.filter(x => x.count === tokens)[0];

        let winner;
        if (corner.right.filter(x => tiles[x] === '1').length === tokens) {
            winner = '1';
        } else if (corner.left.filter(x => tiles[x] === '2').length === tokens) {
            winner = '2';
        } else {
            winner = '0';
        }

        if (edit !== false) {
            this.setState({ winner: winner })
        }

        return winner;
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

    possible_moves(position) {
        var dirs = ['l', 'r', 'u', 'd'];

        var directions = [];
        dirs.forEach(dir => {
            var pos = GameTools.goTo(dir, position, 1)
            if (pos !== null) {
                directions.push(pos)
            }
        })

        var hoppable = [];

        for (const direction of directions) {
            if (this.state.tiles[direction] === '0') {
                hoppable.push(direction)
            }
        }

        var visited = [];
        var unvisited = [position];

        while (unvisited.length) {
            var newVisited = [];
            for (const pos of unvisited) {
                newVisited.push(...possible_hops(this.state.tiles, pos).filter(x => x !== null && !visited.includes(x)))
            }

            visited.push(...unvisited)

            unvisited = newVisited;
        }

        return [...hoppable, ...possible_hops(this.state.tiles, position).filter(x => x !== null), ...visited.filter(x => x !== position && x !== null)]
    }

    move(player, from, to) {
        const validation = validateMove(this.state.tiles, this.state.turn, player, from, to);
        if (validation.success) {
            this.moves.push([from, to])
            this.setState({ tiles: validation.tiles, turn: validation.turn, pun: PUN.getPUN(this.gameType, this.moves) })
            return { ...validation, win: this.validateWin(true, validation.tiles)}
        } else {
            return validation;
        }
        
    }

    mv(player, x1, y1, x2, y2) {
        return this.move(Player[player === 'w' ? 'WHITE' : 'BLACK'], Coordinates.convertPos(x1, y1), Coordinates.convertPos(x2, y2))
    }
}