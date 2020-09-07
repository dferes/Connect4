/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */


class Game {
  constructor(player1, player2, height = 6, width = 7) {
    this.currentPlayer = player1;
    this.height = height;
    this.width = width;
    this.board = [];
    this.players = [player1, player2];
    this.columnTop = null;
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
  }

}


/* board = array of rows, each row is array of cells  (board[y][x]) */
Game.prototype.makeBoard = function () {
  for (let y = 0; y < this.height; y++) {
    this.board.push(Array.from({ length: this.width }));
  }

}


/* makeHtmlBoard: make HTML table and row of column tops. */
Game.prototype.makeHtmlBoard = function () {
  document.getElementById('board').className = "board";
  this.handleThisClick = this.handleClick.bind(this); // pointer to this board object
  const board = document.getElementById('board');
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  top.addEventListener('click', this.handleThisClick);

  for (let x = 0; x < this.width; x++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('class', 'cell');
    headCell.setAttribute('id', x);
    top.append(headCell);
  }

  board.append(top);
  
  this.columnTop = document.getElementById('column-top');
  this.hoverColorOfPlayer();

  for (let y = 0; y < this.height; y++) {
    const row = document.createElement('tr');
    for (let x = 0; x < this.width; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      cell.setAttribute('class', 'cell');
      row.append(cell);
    }
    board.append(row);
  }
}



/*  hoverColorOfPlayer: adds eventlisteners to simulate a hover effet that 
    changes the color of the top row 
*/
Game.prototype.hoverColorOfPlayer = function () {
  const players_ = this.players;
  const this_ = this;

  for (let cell of this.columnTop.children) {
    cell.addEventListener('mouseenter', function (evt) {
      let currentPlayerIndex = this_.currentPlayer === players_[0] ? 0 : 1;
      this.style.backgroundColor = players_[currentPlayerIndex].color;
    })
    
    cell.addEventListener('mouseleave', function () {
      this.style.backgroundColor = '';
    })

    cell.addEventListener('click', function () {
      let currentPlayerIndex = this_.currentPlayer === players_[0] ? 1 : 0;
      this.style.backgroundColor = players_[currentPlayerIndex].color;
    })
  }
  
}




/* findSpotForCol: given column x, return top empty y (null if filled) */
Game.prototype.findSpotForCol = function (x) {
  for (let y = this.height - 1; y >= 0; y--) {
    if (!this.board[y][x]) {return y;}
  }
  return null;
}




/* placeInTable: update DOM to place piece into HTML table of board */
Game.prototype.placeInTable = function(y, x) {
  const newDivPiece = document.createElement('div');
  newDivPiece.setAttribute('class', 'piece');
  newDivPiece.style.backgroundColor = this.currentPlayer.color;
  const cellXY = document.getElementById(`${y}-${x}`);
  cellXY.append(newDivPiece);
}




/* endGame: announce game end */
Game.prototype.endGame = function (msg) {
  const top = document.getElementById('column-top');
  top.removeEventListener('click', this.handleThisClick);
  this.redoButton();
}



Game.prototype.redoButton = function () {
  const restartButton = document.createElement('button');
  restartButton.innerText = "Restart";
  restartButton.addEventListener('click', () => {
    window.location.reload(true);
  })
  document.querySelector('.restart-container').append(restartButton);
}




/* handleClick: handle click of column top to play piece */
Game.prototype.handleClick = function (evt) {
  const x = +evt.target.id;
  const y = this.findSpotForCol(x);

  if (y === null) { return; }

  this.board[y][x] = this.currentPlayer;
  this.placeInTable(y, x);
  
  if (this.checkForWin()) {
    this.gameOver = true;
    return this.endGame(`Player ${this.currentPlayer.color} won!`);
  }
  
  if (this.board.every(row => row.every(cell => cell))) {
    return this.endGame('Tie!');
  }
    
  this.currentPlayer = this.players[0] === this.currentPlayer ? this.players[1] : this.players[0];
}





/* checkForWin: check board cell-by-cell for "does a win start here?" */
Game.prototype.checkForWin = function () {
  const _win = (cells) =>
    cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.height &&
        x >= 0 &&
        x < this.width &&
        this.board[y][x] === this.currentPlayer
    );

  for (let y = 0; y < this.height; y++) {
    for (let x = 0; x < this.width; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        let winningText = document.querySelector('.winner');
        winningText.innerText = `Player  ${this.currentPlayer.color}  won!`;
        winningText.style.color = this.currentPlayer.color;
        return true;
      }
    }
  }
}


class Player {
  constructor(color) {
    this.color = color;
  }
}


document.addEventListener('DOMContentLoaded', function () {
  let gameInstance = false;
  document.getElementById('start-game').addEventListener('click', () => {
    if (!gameInstance) {
      let p1 = new Player(document.getElementById('p1-color').value);
      let p2 = new Player(document.getElementById('p2-color').value);
      new Game(p1, p2);
      gameInstance = true;
    }
  })

});
