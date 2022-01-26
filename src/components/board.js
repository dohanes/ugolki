import React from 'react';
import Square from './square.js';

class Board extends React.Component {

    constructor(props) {
        super(props)

        this.state = { selected: null }

        this.possibilities = [];
    }

    handleClick(i) {
        if (this.state.selected === i) {
            this.setState({ selected: null })
            this.possibilities = [];
        } else if (this.state.selected === null) {
            this.setState({ selected: i })
            this.possibilities = this.props.possible_moves(i)
        }
    }

    renderSquares(tileRow, index) {
        let tiles = tileRow[0].split('');
        return (<>
            <div className="row">
                {
                    tiles.map((t, i) => {
                        let squareIndex = (i + (index * 8));
                        return <Square type={t} index={squareIndex} selected={this.state.selected === squareIndex} onClick={() => this.handleClick(squareIndex)} is_possibility={this.possibilities.includes(squareIndex)} />
                    })
                }
            </div>
        </>)
    }

    render() {
        let tilesByRow = [];
        for (var i = 0; i < this.props.tiles.length; i += 8) {
            tilesByRow.push([this.props.tiles.substr(i, 8)])
        }
        return (<> {
            tilesByRow.map((tileRow, index) => {
                return this.renderSquares(tileRow, index)
            })
        } </>);
    }
}

export default Board;