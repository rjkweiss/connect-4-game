const Screen = require("./screen");
const Cursor = require("./cursor");

class ConnectFour {

  constructor() {

    this.playerTurn = "O";

    this.grid = [[' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' ']];

    this.cursor = new Cursor(6, 7);

    // Initialize a 6x7 connect-four grid
    Screen.initialize(6, 7);
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
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[0].length; col++) {
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

    // directions that we can move at each (row, col)
    let directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

    // check if there is a winner in horizontal, vertical or diagonal directions
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const currCell = grid[row][col];

        if (currCell !== " ") {
          for (let [dr, dc] of directions) {
            if (ConnectFour.checkDirection(grid, row, col, dr, dc)) {
              return currCell;
            }
          }
        }
      }
    }

    // Return 'T' if the game is a tie
    if(grid.flat().every(cell => cell !== " ")) {
      return "T";
    }

    // Return false if the game has not ended
    return false;

  }

  static checkDirection(grid, row, col, dr, dc) {

    const currCell = grid[row][col];

    for (let index = 0; index < 4; index++) {
      const nextRow = row + index * dc;
      const nextCol = col + index * dr;

      // check if boundaries are valid or we found a cell with other player's mark
      if (nextRow < 0 || nextRow >= grid.length || nextCol < 0 || nextCol >= grid[0].length || grid[nextRow][nextCol] !== currCell) {
        return false;
      }
    }
    return true;
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
