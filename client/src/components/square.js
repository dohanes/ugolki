import React from 'react';

import Coordinates from 'ugolki-lib/coordinates';

class Square extends React.Component {
    handleClick() {
        this.setState({ selected: true })
    }

    renderToken() {
        if (this.props.is_possibility) {
            return <div className="possibility"></div>;
        } else if (this.props.type !== '0') {
            return <div className={"token " + (this.props.type === '1' ? 'token-white' : 'token-black')}></div>;
        }
        
    }

    renderText() {
        const [char1, char2] = Coordinates.convertToStandardFromPos(this.props.index).split('');
        if (char1 === 'h' && char2 === '8') {
            return <><span className={"col-label" + (this.props.antiRotate ? ' anti-rotate' : '')}>{char1}</span><span className={"row-label" + (this.props.antiRotate ? ' anti-rotate' : '')}>{char2}</span></>;
        } else if (char2 === '8') {
            return <span className={"col-label" + (this.props.antiRotate ? ' anti-rotate' : '')}>{char1}</span>;
        } else if (char1 === 'h') {
            return <span className={"row-label" + (this.props.antiRotate ? ' anti-rotate' : '')}>{char2}</span>;
        }
    }


    render() {
        return <div className={"square" + (this.props.selected ? ' selected' : '')} onClick={this.props.onClick}>{this.renderToken()}{this.renderText()}</div>;
    }
}

export default Square;