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
        return <Square key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
    }
    
    fillN(vector){
        for(var i=0; i<vector.length; i++){
            vector[i] = i;
        }
        return vector;
    }
    
    fillMod3(vector){
        var count=0;
        for(var i=0; i<vector.length; i++){
            vector[i]=count;
            count += 3;
        }
        return vector;
    }
    
    render(){   
        var index1 = this.fillMod3(Array(3));
        /*
        var index1 = this.fillN(Array(3));   
        var index2 = this.fillN(Array(3));
        */
        
        return(
            /*
            <div>
                {index1.map((e1,i1) => {
                    return(
                        <div key={i1} className="board-row">
                            {index2.map((e2, i2) => {
                                return(this.renderSquare(i2))
                            })}
                        </div>
                    )    
                })}
            </div>
            */    
        
            <div>
                {index1.map((e,i) => {
                    return(
                        <div key={i} className="board-row">
                            {this.renderSquare(e)}
                            {this.renderSquare(e+1)}
                            {this.renderSquare(e+2)}
                        </div>
                    )    
                })}
            </div>
            
            
            /*
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
            */
        );
        
    }
}

class Game extends React.Component {
    constructor(){
        super();
        this.state = {
            history: {
                squares: [{
                    situation: Array(9).fill(null),
                    playerWasX: false
                }]
            },
            isXNext: true,
            stepNumber: 0,
        }
    }
    
    handleClick(i){
        //raccolgo tutta la storia delle mosse
        const history = this.state.history;
        //recupero l'oggetto squares che è un Array[] di oggetti {sitation: someVar, player: true/false}
        var squaresHistory = history.squares.slice();
        //prendo l'ultima situazione(quadrati+player)
        var currentSquaresHistory = squaresHistory[squaresHistory.length - 1];
        //raccolgo la situazione solo dei quadrati
        var currentSquaresSituation = currentSquaresHistory.situation.slice();
        var currentPlayer = !currentSquaresHistory.playerWasX;
        
        //ignore when box already clicked or someone already won
        if (calculateWinner(currentSquaresSituation) || currentSquaresSituation[i]) {
            return;
        }
        //modifico la situazione attinente al click
        currentSquaresSituation[i] = this.state.isXNext ? 'X' : 'O';
        //creo una nuova situazione
        var newSituation = [{
            situation: currentSquaresSituation,
            playerWasX: currentPlayer
        }];
        //la aggiungo alle situazioni precedenti
        squaresHistory = squaresHistory.concat(newSituation);
        //creo una nuova storia
        var newHistory = {
            squares: squaresHistory
        }

        //modifico lo stato
        this.setState((prevState) => ({
            history: newHistory,
            isXNext: !prevState.isXNext,
            stepNumber: prevState.history.squares.length
        }));
    }
    
    jumpTo(step) {
        this.setState((prevState) => ({
            stepNumber: step,
            xIsNext: (step % 2) ? false : true,
        }));
    }
    
    getPlayerMovesNumber(player, situation){
        var counter = 0;
        var i = 0;
        if (player){
            for(i=0; i<situation.length; i++){
                if (situation[i]==='X'){
                    counter++;
                }
            }
        }else{
            for(i=0; i<situation.length; i++){
                if (situation[i]==='O'){
                    counter++;
                }
            }
        }
        
        return counter;
    }
    
    render() {            
        const squaresHistory = this.state.history.squares;
        const currentSquares = squaresHistory[this.state.stepNumber].situation;
        const winner = calculateWinner(currentSquares); 
        
        //react element for showing moves
        const moves = squaresHistory.map((step, move) => {
            const checkStepNumber = this.state.stepNumber===move ? 1 : 0;
            const player = step.playerWasX ? 1 : 2;
            const _move = this.getPlayerMovesNumber(player, step.situation);
            const desc = move ? 'Move (' + player + ',' + _move + ')' : 'Game start';
            
            if (checkStepNumber){
                return(
                    <b key={move}>
                        <li>
                            <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
                        </li>
                    </b>
                );
            }else{
                return(
                    <li key={move}>
                        <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
                    </li>               
                );
            }
        });

        var f = this.state.history.squares[this.state.stepNumber].playerWasX;
        let status;
        if (f===true){
            status = 'Next player: X';
        }else{
            status = 'Next player: O';
        }    

        if(winner){
            status = 'Winner: ' + winner;
        }else{
            status = 'Next Player: ' + (this.state.isXNext ? 'X' : 'O');
        }
        
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={currentSquares} 
                        onClick={(i) => this.handleClick(i)} 
                    />
                    <br/>
                    <label>Order Moves</label><br/>
                    <label className="switch">
                        <input type="checkbox" />
                        <div className="slider"></div>
                    </label>
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