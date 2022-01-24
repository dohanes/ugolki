import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from'./game.js';

class Square extends React.Component {
    render() {
        return (
            <div className="square">
                {/* TODO */}
            </div>
        );
    }
}

class Row extends React.Component {
    render() {
        return (
            <div className="row">
                <Square /><Square /><Square /><Square /><Square /><Square /><Square /><Square />
            </div>
        )
    }
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square />;
    }

    render() {
        return (<> <Row /><Row /><Row /><Row /><Row /><Row /><Row /><Row /> </>);
    }
}

// ========================================

ReactDOM.render(
    <Board />,
    document.getElementById('root')
);
