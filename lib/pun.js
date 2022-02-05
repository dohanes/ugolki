/*
Example PUN (Portable Ugolki Notation):

3x3>b2-b4,g8-g6
 */

const gameTypes = ['3x3', '3x4', '4x4']
const cols = 'abcdefg'.split();
const rows = '12345678'.split();

export default class PUN {
    static isValid(pun) {
        if (typeof pun !== 'string' || !pun || !pun.includes('>')) return false;
        const [gameType, rawMoves] = pun.split('>')

        if (!gameTypes.includes(gameType)) return false;

        const moves = rawMoves.split(',')

        for (const move of moves) {
            if (move.length !== 5 || !cols.includes(move[0]) || !rows.includes(move[1]) || move[2] !== '-' || !cols.includes(move[3]) || !rows.includes(move[4])) return false;
        }

        return true;
    }

    static getMoves(pun) {
        if (!isValid(pun)) return null;

        const moves = pun.split('>')[1].split(',')

        for (const move of moves) {
            
        }
    }

    static getUGN(type, moves) {

    }
}