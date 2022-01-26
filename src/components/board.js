import React from 'react';
import Square from './square.js';

class Board extends React.Component {
    renderSquares(t, index) {
        let tiles = t[0].split('');
        return (<>
            <div className="row">
                {
                    tiles.map((t, i) => {
                        return <Square type={t} index={(i + (index * 8))} />
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