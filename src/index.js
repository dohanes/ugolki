import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from'./game.js';

class Square extends React.Component {
    render() {
        return (
            <button className="square">
                {/* TODO */}
            </button>
        );
    }
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square />;
    }

    render() {
        return (<> <Square /><Square /><Square /><Square /><Square /><Square /><Square /><Square /> <br /> <Square /><Square /><Square /><Square /><Square /><Square /><Square /><Square /> </>);
    }
}

// ========================================

ReactDOM.render(
    <Board />,
    document.getElementById('root')
);
