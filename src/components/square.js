import React from 'react';

class Square extends React.Component {
    handleClick() {
        this.setState({ selected: true })
    }

    renderToken() {
        if (this.props.type === '0') return '';

        return <div className={"token " + (this.props.type === '1' ? 'token-white' : 'token-black')}></div>;
    }


    render() {
        return <div className={"square" + (this.props.selected ? ' selected' : '')} onClick={this.props.onClick}>{this.renderToken()}</div>;
    }
}

export default Square;