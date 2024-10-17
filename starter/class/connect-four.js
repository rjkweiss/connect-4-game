const Screen = require("./screen");
const Cursor = require("./cursor");

class ConnectFour {

  constructor() {

    this.playerTurn = "O";

    this.grid = [[' ',' ',' ',' '],
                 [' ',' ',' ',' '],
                 [' ',' ',' ',' '],
                 [' ',' ',' ',' ']];

    this.cursor = new Cursor(4, 4);

    // Initialize a 6x7 connect-four grid
    Screen.initialize(4, 4);
    Screen.setGridlines(true);
    this.updateGrid();

    // Replace this with real commands
    this.initializeCommands();


    this.cursor.setBackgroundColor();
    Screen.render();
  }

  initializeCommands() {
    Screen.addCommand('m', 'make a move', this.makeMove.bind(this));
    Screen.addCommand('up', 'move up', this.cursor.up.bind(this.cursor));
    Screen.addCommand('down', 'move down', this.cursor.down.bind(this.cursor));
    Screen.addCommand('left', 'move left', this.cursor.left.bind(this.cursor));
    Screen.addCommand('right', 'move right', this.cursor.right.bind(this.cursor));
  }

  updateGrid() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        Screen.setGrid(row, col, this.grid[row][col]);
        Screen.setTextColor(row, col, 'green');
      }
    }
    Screen.render();
  }

  makeMove() {
    const { row: currRow, col: currCol } = this.cursor;

    // check if empty and play
    if (this.grid[currRow][currCol] === " ") {

      this.grid[currRow][currCol] = this.playerTurn;

      // check if there was a winner
      let winner = ConnectFour.checkWin(this.grid);

      if (winner) {
        ConnectFour.endGame(winner);
      } else {
        this.playerTurn = this.playerTurn === "O" ? "X": "O";
      }
      this.updateGrid();
    }
  }

  static checkWin(grid) {
    let rows = grid.length, cols = grid[0].length;
    // Return 'X' if player X wins or 'O' if player O wins
    for (let row = 0; row < rows; row++) {
      // record each player's markers on each row
      let col1 = grid[row][0], col2 = grid[row][1], col3 = grid[row][2], col4 = grid[row][3];
      if(col1 === col2 && col2 === col3 && col3 === col4 && col1 != " ") {
        return col1;
      }

      let row1 = grid[0][row], row2 = grid[1][row], row3 = grid[2][row], row4 = grid[3][row];

      if (row1 === row2 && row2 === row3 && row3 === row4 && row1 !== " ") {
        return row1;
      }
    }

    // check diagonal
    if (grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]&& grid[2][2] === grid[3][3]&& grid[0][0] !== " ") {
      return grid[0][0];
    }

    if (grid[0][3] === grid[1][2] && grid[1][2] === grid[2][1]&& grid[2][1] === grid[3][0]&& grid[0][3] !== " ") {
      return grid[0][3];
    }


    // Return 'T' if the game is a tie
    if(grid.flat().every(cell => cell !== " ")) {
      return "T";
    }
    // Return false if the game has not ended
    return false;

  }

  static endGame(winner) {
    if (winner === 'O' || winner === 'X') {
      Screen.setMessage(`Player ${winner} wins!`);
    } else if (winner === 'T') {
      Screen.setMessage(`Tie game!`);
    } else {
      Screen.setMessage(`Game Over`);
    }
    Screen.render();
    Screen.quit();
  }

}

module.exports = ConnectFour;
