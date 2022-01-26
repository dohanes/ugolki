import React from 'react';

class Token extends React.Component {
    render() {
        return (
            <div className={"token " + (this.props.type === '1' ? 'token-white' : 'token-black')}></div>
        )
    }
}

export default Token;