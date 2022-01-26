import React from 'react';
import Token from './token.js';

class Square extends React.Component {
    handleClick() {
        this.setState({ selected: true })
    }


    render() {
        const desc = this.props.type !== '0' ? <Token type={this.props.type} /> : ''
        return <div className={"square" + (this.props.selected ? ' selected' : '')} onClick={() => this.handleClick()}>{desc}</div>;
    }
}

export default Square;