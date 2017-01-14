import React from 'react';
import './css/Game.css';

function Square(props){    
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {    
    renderSquare(i) {
        return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
    }
    
    render() {  
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(){
        super();
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            isXNext: true,
            stepNumber: 0
        }
    }
    
    handleClick(i){
        const history = this.state.history;
        const current = history[history.length - 1];
        const squares = current.squares.slice();      //slice() returns a shallow copy of the array -> we want this beacause we want immutable objects
        
        //ignore when box already clicked or someone already won
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.isXNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            isXNext: !this.state.isXNext,
            stepNumber: history.length
        });
    }
    
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) ? false : true,
        });
    }
    
    render() {            
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares); 
        var player = current.player;
        
        //react element for showing moves
        const moves = history.map((step, move) => {
            const desc = move ? 'Move (' + player + "," + move + ')' : 'Game start';
            return (
                <li key={move}>
                    <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
                </li>
            );
        });
        
        let status = this.state.isXNext ? 'Next player: X' : 'Next player: O';        
        if(winner){
            status = 'Winner: ' + winner;
        }else{
            status = 'Next Player: ' + (this.state.isXNext ? 'X' : 'O');
        }
        
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        player={player}
                        squares={current.squares} 
                        onClick={(i) => this.handleClick(i)} 
                    />
                </div>
                <div className="game-info">
                    <div>
                        {status}
                        <ol>{moves}</ol>
                    </div>
                </div>
            </div>
        );
    }
}

// ========================================

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default Game;