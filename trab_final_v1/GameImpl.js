class GameImpl {

  // colors = number of different colors (values)
  constructor(width, height, colors) {
    this.score = 0;
    this.colors = colors;
    this.height = height;
    this.width = width;
  }

  // Initializes the grid of the game with no matches (3 consecutive cells with the same value).
  initialize() {
    this.grid = [];
    for (let i = 0; i < this.height; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.width; j++) {
        let randomValue = Math.floor(Math.random() * this.colors) + 1
        this.grid[i][j] = {
          value: randomValue,
          row: i,
          column: j
        }

        // if a match is formed horizontally, change the value
        while ((j > 1) && (this.grid[i][j].value == this.grid[i][j-1].value) && (this.grid[i][j].value == this.grid[i][j-2].value)) {
          let newRandomValue = Math.floor(Math.random() * this.colors) + 1;
          this.grid[i][j].value = newRandomValue;
        }

        // if a match is formed vertically, change the value
        while ((i > 1) && (this.grid[i][j].value == this.grid[i-1][j].value) && (this.grid[i][j].value == this.grid[i-2][j].value)) {
          let newRandomValue = Math.floor(Math.random() * this.colors) + 1;
          this.grid[i][j].value = newRandomValue;
        }
      }
    }
  }

  // Returns cell object
  getCell(row, col) {
    return this.grid[row][col];
  }

  // Returns the grid Width
  getWidth() {
    return this.width;
  }
  
  // Returns the grid Height
  getHeight() {
    return this.height;
  }

  // Returns the game score
  getScore() {
    return this.score;
  }

  // Swaps the values of cells [i][j] with [k][l]
  // If cells are adjacent and have different values, 
  // validSelection = true, the cells are swapped,
  // the matches are removed and the cells fall down, as the score grows in 10*cells removed.
  // Else, nothing happens to the grid and validSelection = false
  // validSelection is allways returned.
  select(i, j, k, l) {
    let validSelection = false;

    if (i == k || j == l) {
      if (Math.abs(i-k) == 1  || Math.abs(j-l) == 1) {
        let temp = this.swapCells(i, j, k, l);
        
        if (temp[0] != temp[1]) {

          var matches = this.findRuns(true);
          console.log(matches);
          if (matches.length > 0) {
            validSelection = true;
            this.score += 10*matches.length;
            this.shiftNullsUp();
            this.replaceNulls();

            matches = this.findRuns(true);
            while (matches.length > 0) {
              this.score += 10*matches.length;
              this.shiftNullsUp();
              this.replaceNulls();
              matches = this.findRuns(true);
            }
          } else {
            this.swapCells(i, j, k, l);
          }
        } 
      }
    }
    return validSelection;
  }

  // nullsArray = numberOfNulls array from getNulls()
  // shiftUp will shift every null up to the top of the board
  shiftNullsUp() {
    for (let j = 0; j < this.getWidth(); j++) {
      for (let i = 0; i < this.getHeight(); i++) {
        if (this.grid[i][j].value == null) {
          let row = i;
          while (row >= 1) {
            console.log(row, j, row-1, j);
            this.swapCells(row, j, row-1, j);
            row--;
          }
        }
      }
    }
  }

  // Swaps 2 Cells
  swapCells(i, j, k, l) {
    let temp1 = this.grid[k][l].value;
    let temp2 = this.grid[i][j].value;

    this.grid[i][j].value = temp1;
    this.grid[k][l].value = temp2;

    return [temp1, temp2];
  }

  // Returns a runs array with [row, column] arrays, indicating all the matches made.
  // if doMarkAndUpdateScore == true, the runs are nulled.
  findRuns(doMarkAndUpdateScore) {
    let runs = [];

    for (let i = 0; i < this.getHeight(); i++) {
      for (let j = 0; j < this.getWidth()-3; j++) {
        if (this.grid[i][j].value == this.grid[i][j+1].value && this.grid[i][j+1].value == this.grid[i][j+2].value) {
          runs.push([i,j], [i,j+1], [i,j+2]);
        }
      }
    }

    for (let i = 0; i < this.getWidth(); i++) {
      for (let j = 0; j < this.getHeight()-2; j++) {
        if (this.grid[j][i].value == this.grid[j+1][i].value && this.grid[j+1][i].value == this.grid[j+2][i].value) {
          runs.push([j,i], [j+1,i], [j+2,i]);
        }
      }
    }

    if (doMarkAndUpdateScore && runs.length > 0) {
      for (let cell of runs) {
        this.grid[cell[0]][cell[1]].value = null;
      }
    }

    return runs;
  }

  // Counts the number of null cells in each column.
  getNulls() {
    let numberOfNulls = [];
    for (let i = 0; i < this.getWidth(); i++) {
      let counter = 0;
      
      for (let j = 0; j < this.getHeight(); j++) {
        if (this.isNull(j, i)) {
          counter += 1;
        }
      }

      numberOfNulls.push(counter);
    }
    return numberOfNulls;
  }

  // Finds returns a nulls array with all the null cells's coordinates.
  findNulls() {
    let nulls = []
    for (let i = 0; i < this.getWidth(); i++) {
      for (let j = 0; j < this.getHeight(); j++) {
        if (this.isNull(i, j)) {
          nulls.push([i,j]);
        }
      }
    }
    return nulls;
  }

  // Replaces all null cells with random values.
  replaceNulls() {
    let nulls = this.findNulls();
    for (let n of nulls) {
      this.grid[n[0]][n[1]].value = Math.floor(Math.random() * this.colors) + 1
    }
  }
  
  // Returns true if cell is null.
  isNull(i, j) {
    if (this.grid[i][j].value == null) {
      return true;
    }
    return false;
  }
}

game = new GameImpl(10, 10, 4);
game.initialize();