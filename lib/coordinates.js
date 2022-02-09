const cols = 'abcdefgh'.split('');
const rows = '12345678'.split('');

export default class Coordinates {
    static convertPos(x, y) {
        if (x < 1 || x > 8 || y < 1 || y > 8) return null;
        return (x - 1) + ((y - 1) * 8);
    }

    static convertCoords(pos) {
        var x = (pos % 8) + 1;
        var y = Math.floor(pos / 8) + 1;
        return [x, y];
    }

    static convertToPosFromStandard(standard) {
        var x = cols.indexOf(standard[0]) + 1;
        var y = rows.indexOf(standard[1]) + 1;

        if (x < 1 || y < 1) return null;

        return Coordinates.convertPos(x, y);
    }

    static convertToStandardFromPos(pos) {
        const [x, y] = Coordinates.convertCoords(pos);

        return (cols[x-1]) + (rows[y-1]);
    }
}