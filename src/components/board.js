import React from 'react';
import Square from './square.js';

class Board extends React.Component {
    renderSquares(t, index) {
        let tiles = t[0].split('');
        return (<>
            <div className="row">
                {
                    tiles.map((t, i) => {
                        let squareIndex = (i + (index * 8));
                        return <Square type={t} index={squareIndex} onClick={() => this.props.onClick(squareIndex)} />
                    })
                }
            </div>
        </>)
    }

    render() {
        let tiles = [];
        for (var i = 0; i < this.props.tiles.length; i += 8) {
            tiles.push([this.props.tiles.substr(i, 8)])
        }
        return (<> {
            tiles.map((t, index) => {
                return this.renderSquares(t, index)
            })
        } </>);
    }
}

export default Board;