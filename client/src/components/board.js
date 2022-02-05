import React from 'react';
import Square from './square.js';

class Board extends React.Component {

    constructor(props) {
        super(props)

        this.state = { selected: null }

        this.possibilities = [];
    }

    handleClick(i) {
        if (this.props.winner === '0') {
            if (this.possibilities.includes(i)) {
                this.props.move(this.state.selected, i)
                this.possibilities = [];
                this.setState({ selected: null })
            } else if (this.props.tiles[i] === this.props.turn && this.state.selected !== i) {
                this.setState({ selected: i })
                this.possibilities = this.props.possible_moves(i)
            } else {
                this.setState({ selected: null })
                this.possibilities = [];
            }
        }
    }

    renderSquares(tileRow, index) {
        let tiles = tileRow[0].split('');
        return (<>
            <div className="board-row" key={index}>
                {
                    tiles.map((t, i) => {
                        let squareIndex = (i + (index * 8));
                        return <Square antiRotate={this.props.turn === '1'} type={t} key={squareIndex} index={squareIndex} selected={this.state.selected === squareIndex} onClick={() => this.handleClick(squareIndex)} is_possibility={this.possibilities.includes(squareIndex)} />
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
        return (<div className={"board" + (this.props.turn === '1' ? ' board-rotate' : '')}> {
            tilesByRow.map((tileRow, index) => {
                return this.renderSquares(tileRow, index)
            })
        }</div>);
    }
}

export default Board;