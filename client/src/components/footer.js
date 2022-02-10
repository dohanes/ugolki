import React from 'react';

class Footer extends React.Component {
    render() {
        return (
            <footer className="pt-4 my-md-5 pt-md-5 border-top">
                <span className="text-muted">&copy; {(new Date().getFullYear())} Daniel Ohanessian. All rights reserved. <a target="_blank" rel="noreferrer" href="https://github.com/dohanes/ugolki">Open source on GitHub!</a></span>
            </footer>
        )
    }
}

export default Footer;