import React from 'react';

class Footer extends React.Component {
    render() {
        return (
            <footer className="pt-4 my-md-5 pt-md-5 border-top">
                <h3>Ugolki.net</h3>
                <h5>What is Ugolki?</h5>
                <p><a href="https://en.wikipedia.org/wiki/Ugolki" target="_blank" rel="noreferrer">Ugolki</a> (or Corners) is a two-player board game that is played on a 8x8 board using checkers tokens. Your options for moves are either hopping over other pieces, (regardless if they are yours or not) or moving one space in any parallel direction.<br/>You are able to hop consecutively over as many pieces as you want, if possible<br/>The objective of the game is to move all your pieces to the opposite corner of the board in the same exact formation, basically occupying all the spaces that the opponent's pieces used to be at the start of the game.</p>
                <br/>
                <span className="text-muted">&copy; {(new Date().getFullYear())} Daniel Ohanessian. All rights reserved. <a target="_blank" rel="noreferrer" href="https://github.com/dohanes/ugolki">Open source on GitHub!</a></span>
            </footer>
        )
    }
}

export default Footer;