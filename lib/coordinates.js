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

    static convertToStandard(pos) {
        
    }
}