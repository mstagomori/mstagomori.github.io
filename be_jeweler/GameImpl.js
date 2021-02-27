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

    let cellsArray = [];

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

        let container = document.getElementById("game-container");
        var containerSize = container.clientHeight;
        
        let cell = document.createElement("div");
        cell.setAttribute("draggable", true);
        cell.style.position = "relative";
        cell.style.width = (containerSize / this.getWidth).toString();
        cell.style.height = (containerSize / this.getHeight).toString();
        cell.style.background = this.generateCellColor(this.getCell(i,j).value);
        cell.style.border = "1px solid black";
        cell.id = "cell"+ "_" + i.toString() + "_" + j.toString();
        cell.className = "cell";

        cellsArray.push(cell);
        
        container.appendChild(cell);
      }
    }

    return cellsArray;
  }

  generateCellColor(value) {
    if (value == 1) {
      return("#1769c7")
    
    } else if (value == 2) {
      return("#4ec516")
    
    } else if (value == 3) {
      return("#ffaa00")
    
    } else if (value == 4) {
      return("#ff2200")
    
    } else if (value == 5) {
      return("#b716c5")
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

  addScore(value) {
    this.score += value;
  }

  // nullsArray = numberOfNulls array from getNulls()
  // shiftUp will shift every null up to the top of the board
  shiftNullsUp() {
    for (let j = 0; j < this.getWidth(); j++) {
      for (let i = 0; i < this.getHeight(); i++) {
        if (this.grid[i][j].value == null) {
          let row = i;
          while (row >= 1) {
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
      for (let j = 0; j < this.getWidth()-2; j++) {
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
cellsArray = game.initialize();

ID_ARRAY = [];
var counter = 0;
for (let i = 0; i < game.getWidth(); i++) {
  ID_ARRAY.push([]);
  for (let j = 0; j < game.getHeight(); j++) {
    ID_ARRAY[i][j] = counter;
    counter++;
  }
}

let colorHolded;
let colorSwapped;
let cellIdBeingDragged;
let cellIdBeingReplaced;

cellsArray.forEach(cell => cell.addEventListener('dragstart', dragStart));
cellsArray.forEach(cell => cell.addEventListener('dragend', dragEnd));
cellsArray.forEach(cell => cell.addEventListener('dragover', dragOver));
cellsArray.forEach(cell => cell.addEventListener('dragenter', dragEnter));
cellsArray.forEach(cell => cell.addEventListener('dragleave', dragLeave));
cellsArray.forEach(cell => cell.addEventListener('drop', dragDrop));

function dragStart(){
  colorHolded = this.style.backgroundColor;
  cellIdBeingDragged = this.id.split("_");
}

function dragEnd(){
  let i = cellIdBeingDragged[1];
  let j = cellIdBeingDragged[2];
  let k = cellIdBeingReplaced[1];
  let l = cellIdBeingReplaced[2];
  
  if (i == k || j == l) {
    if (Math.abs(i-k) == 1  || Math.abs(j-l) == 1) {
      game.swapCells(i, j, k, l);
      let tempAllRuns = game.findRuns(false);
      if (tempAllRuns.length == 0){
        game.swapCells(k, l, i, j);
        cellsArray[ID_ARRAY[i][j]].style.backgroundColor = colorHolded;
        cellsArray[ID_ARRAY[k][l]].style.backgroundColor = colorSwapped;
      }
    
    } else {
      cellsArray[ID_ARRAY[i][j]].style.backgroundColor = colorSwapped;
      cellsArray[ID_ARRAY[k][l]].style.backgroundColor = colorHolded;
    }
  } else {
    cellsArray[ID_ARRAY[i][j]].style.backgroundColor = colorHolded;
    cellsArray[ID_ARRAY[k][l]].style.backgroundColor = colorSwapped;
  }
}

function dragOver(e) {
  e.preventDefault()
}

function dragEnter(e) {
  e.preventDefault()
}

function dragLeave(){
  
}

function dragDrop(){
  colorSwapped = this.style.backgroundColor;
  cellIdBeingReplaced = this.id.split("_");
  let i = parseInt(cellIdBeingDragged[1]);
  let j = parseInt(cellIdBeingDragged[2]);
  let number = ID_ARRAY[i][j];
  
  this.style.backgroundColor = colorHolded;
  cellsArray[number].style.backgroundColor = colorSwapped;
}

function moveIntoSquareBelow() {
  for (let i = 0; i <= 8; i++) {
    for (let j = 0; j <= 9; j++) {
      if (cellsArray[ID_ARRAY[i + 1][j]].style.backgroundColor === '') {
          cellsArray[ID_ARRAY[i + 1][j]].style.backgroundColor = cellsArray[ID_ARRAY[i][j]].style.backgroundColor
          game.grid[i+1][j].value = game.grid[i][j].value
          cellsArray[ID_ARRAY[i][j]].style.backgroundColor = ''
          const firstRow = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
          const isFirstRow = firstRow.includes(i)
          if (isFirstRow && (cellsArray[ID_ARRAY[i][j]].style.backgroundColor === '')) {
            let randomValue = Math.floor(Math.random() * game.colors) + 1
            cellsArray[ID_ARRAY[i][j]].style.backgroundColor = game.generateCellColor(randomValue)
            game.grid[i][j].value = randomValue
          }
      }
    }
  }    
}


function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function findMatches() {
  let allRuns = game.findRuns(true);
  var unique = allRuns.filter(onlyUnique);
  for (let cell of unique) {
    cellsArray[ID_ARRAY[cell[0]][cell[1]]].style.backgroundColor = ''
  }

  if (unique.length > 5) {
    game.addScore(15)
  } else if (unique.length >= 4) {
    game.addScore(10)
  } else if (unique.length == 3) {
    game.addScore(5)
  }

}

// Intervals
window.setInterval(function() {
  findMatches()
  moveIntoSquareBelow()
  
  
  document.getElementById("ScoreViewer").innerHTML = game.getScore()
}, 1000)