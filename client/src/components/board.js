import React from 'react';
import Square from './square.js';

class Board extends React.Component {

    constructor(props) {
        super(props)

        this.state = { selected: null }

        this.possibilities = [];
    }

    handleClick(i) {
        if ((this.props.player === undefined || this.props.player !== 'NONE') && !this.props.rewound) {
            if (this.props.winner === '0') {
                if (this.possibilities.includes(i)) {
                    if (this.props.player !== undefined) {
                        fetch("/api/game/move", {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ uuid: this.props.uuid, from: this.state.selected, to: i })
                        })
                        .then((res) => res.json())
                        .then((data) => {
                            if (!data.success) {
                                window.location.reload(false)
                            }
                        })
                    }
                    this.props.move(this.state.selected, i)
                    this.possibilities = [];
                    this.setState({ selected: null })
                } else if (this.props.tiles[i] === this.props.turn && this.state.selected !== i && !(this.props.player !== undefined && this.props.tiles[i] !== (this.props.player === 'WHITE' ? '1' : '2'))) {
                    this.setState({ selected: i })
                    this.possibilities = this.props.possible_moves(i)
                } else {
                    this.setState({ selected: null })
                    this.possibilities = [];
                }
            }
        }
    }

    renderSquares(tileRow, index) {
        let tiles = tileRow[0].split('');
        return (<>
                {
                    tiles.map((t, i) => {
                        let squareIndex = (i + (index * 8));
                        return <Square antiRotate={this.props.player !== undefined ? this.props.player === 'WHITE' : this.props.turn === '1'} type={t} key={squareIndex} index={squareIndex} selected={this.state.selected === squareIndex} onClick={() => this.handleClick(squareIndex)} is_possibility={this.possibilities.includes(squareIndex)} />
                    })
                }
        </>)
    }

    render() {
        let tilesByRow = [];
        for (var i = 0; i < this.props.tiles.length; i += 8) {
            tilesByRow.push([this.props.tiles.substr(i, 8)])
        }
        return (<div key="board embed-responsive embed-responsive-1by1" className={"board" + ((this.props.player !== undefined ? this.props.player === 'WHITE' : this.props.turn === '1') ? ' board-rotate' : '')}> {
            tilesByRow.map((tileRow, index) => {
                return this.renderSquares(tileRow, index)
            })
        }</div>);
    }
}

export default Board;