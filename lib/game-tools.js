export const Player = { WHITE: '1', BLACK: '2' }

const numbers = ['１', '２', '３', '４', '５', '６', '７', '８'];

const replaceAt = function (str, index, replacement) {
    return str.substring(0, index) + replacement + str.substring(index + replacement.length);
}

export default class GameTools {
    constructor(state, turn) {
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

    static convertPos(x, y) {
        if (x < 1 || x > 8 || y < 1 || y > 8) return null;
        return (x - 1) + ((y - 1) * 8);
    }

    static convertCoords(pos) {
        var x = (pos % 8) + 1;
        var y = Math.floor(pos / 8) + 1;
        return [x, y];
    }

    static goTo(direction, pos, times) {
        var coords = GameTools.convertCoords(pos);

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

        return GameTools.convertPos(...coords);
    }

    setState(newState) {
        for(const [k, v] of Object.entries(newState)) {
            this.state[k] = v;
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
                state += '2'.repeat(homeWidth) + '0'.repeat(8 - homeWidth)
            } else if ((i === 3 || i === 4) && homeHeight === 3) {
                state += '0'.repeat(8)
            } else {
                state += '0'.repeat(8 - homeWidth) + '1'.repeat(homeWidth)
            }
        }

        return state;
    }

    stateInBase32() {
        return parseInt(this.state.tiles, 3).toString(32)
    }

    validateWin(edit, state) {
        var tiles = state || this.state.tiles;
        var tokens = (tiles.match(/1/g) || []).length;

        var check;

        switch (tokens) {
            case 9:
                check = player => (player.repeat(3) + '00000').repeat(2) + player.repeat(3)
                break;
            case 16:
                check = player => (player.repeat(4) + '0000').repeat(3) + player.repeat(4)
                break;
            default:
                check = player => (player.repeat(3) + '00000').repeat(3) + player.repeat(3)
                break;
        }

        var winner;

        if (tiles.endsWith(check('2'))) {
            winner = '2';
        } else if (tiles.startsWith(check('1'))) {
            winner = '1';
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



    #possible_hops(position) {
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
            if (this.state.tiles[direction[0]] !== '0' && this.state.tiles[direction[1]] === '0') {
                hoppable.push(direction[1])
            } else {
                hoppable.push(null)
            }
        }

        return hoppable;
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
                newVisited.push(...this.#possible_hops(pos).filter(x => x !== null && !visited.includes(x)))
            }

            visited.push(...unvisited)

            unvisited = newVisited;
        }

        return [...hoppable, ...this.#possible_hops(position).filter(x => x !== null), ...visited.filter(x => x !== position && x !== null)]
    }

    move(player, from, to) {
        if (player !== this.state.turn) return { success: false, error: "It is not this player's turn!" }
        if (this.state.turn !== this.state.tiles[from] || from > 64 || to > 64 || from < 0 || to < 0) return { success: false, error: "Invalid token position!" }
        if (from === to) return { success: false, error: "Invalid move!" }

        if (Math.abs(from - to) === 1 || Math.abs(from - to) === 8) {
            let tiles = this.state.tiles.slice();
            tiles = replaceAt(tiles, from, '0');
            tiles = replaceAt(tiles, to, this.state.turn.toString());
            this.setState({ tiles: tiles, turn: this.state.turn === '1' ? '2' : '1' })
            return { success: true, hops: 0, win: this.validateWin(true, tiles) }
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
                tiles = replaceAt(tiles, from, '0');
                tiles = replaceAt(tiles, to, this.state.turn.toString());
                this.setState({ tiles: tiles, turn: this.state.turn === '1' ? '2' : '1' })
                return { success: true, hops: hops, win: this.validateWin(true, tiles) }
            }

            hops++;
        }

        return { success: false, error: "Invalid move!" }
    }

    mv(player, x1, y1, x2, y2) {
        return this.move(Player[player === 'w' ? 'WHITE' : 'BLACK'], GameTools.convertPos(x1, y1), GameTools.convertPos(x2, y2))
    }
}