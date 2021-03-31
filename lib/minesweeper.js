let playing = false;
let newGame = true;

// Speech bubble
const bubble = document.querySelector("#message");
// Table
const table = document.querySelector("#catsweeper");

// Generate tiles
let numTilesRow = 15;
let numTilesCol = 15;

// Less tiles if small screen
if (window.screen.width < 530) {
  numTilesRow = 10;
  numTilesCol = 10;
}

// Create a table of tiles
const generateTiles = (row, col) => {
  for (let i = 0; i < row; i += 1) {
    table.insertAdjacentHTML("beforeend", '<tr></tr>');
  }

  const tr = document.querySelectorAll("tr");

  tr.forEach((r) => {
    for (let j = 0; j < col; j += 1) {
      r.insertAdjacentHTML("beforeend", '<td class="unopened"></td>');
    }
  });
};

generateTiles(numTilesRow, numTilesCol);

// Select all tiles
const tdAll = document.querySelectorAll("td");

// Set number of cats
const catsRatio = 0.1;
const cats = Math.round(catsRatio * (numTilesCol * numTilesRow));

// Create empty 2D tiles array of only 0's
const createTilesArray = () => {
  const tilesArray = [];
  for (let i = 0; i < numTilesRow; i += 1) {
    tilesArray[i] = new Array(numTilesCol).fill(0);
  }
  return tilesArray;
};

// Create  random  integer
const getRandomInt = (minimum, maximum) => {
  const min = Math.ceil(minimum);
  const max = Math.floor(maximum);
  // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min) + min);
};

// Place cats randomly in grid 2d array
const catsArray = createTilesArray();

const createCatsArray = (firstTile) => {
  // Location of initial clicked tile
  const rowIndex = firstTile.parentElement.rowIndex;
  const cellIndex = firstTile.cellIndex;
  let j = 0;
  let r;
  let c;
  while (j < cats) {
    r = getRandomInt(0, numTilesRow);
    c = getRandomInt(0, numTilesCol);
    // Initial clicked tile should not have a cat
    if (catsArray[r][c] !== 1 && (rowIndex !== r && cellIndex !== c)) {
      catsArray[r][c] = 1;
      j += 1;
    }
  }
};


// Index the tile
const indexTile = (tile) => {
  const rowIndex = tile.parentElement.rowIndex;
  const cellIndex = tile.cellIndex;
  return [rowIndex, cellIndex];
};

// Add and remove class name
const changeClass = (tile, name, remove) => {
  tile.classList.add(name);
  tile.classList.remove(remove);
};


const checkIfCatOnTile = (row, col, b) => {
  let catCounter = b;
  // Does tile exist?
  if (catsArray[row] && catsArray[row][col]) {
    if (catsArray[row][col] === 1) {
      catCounter += 1;
    }
  }
  return catCounter;
};

const checkForNeighbouringCats = (tile) => {
  const indexArray = indexTile(tile);
  const row = indexArray[0];
  const col = indexArray[1];
  let b = 0;

  b = checkIfCatOnTile(row, col - 1, b);
  b = checkIfCatOnTile(row, col + 1, b);
  b = checkIfCatOnTile(row - 1, col, b);
  b = checkIfCatOnTile(row + 1, col, b);
  b = checkIfCatOnTile(row + 1, col + 1, b);
  b = checkIfCatOnTile(row - 1, col + 1, b);
  b = checkIfCatOnTile(row + 1, col - 1, b);
  b = checkIfCatOnTile(row - 1, col - 1, b);

  changeClass(tile, `cat-neighbour-${b}`, "unopened");

  if (b === 0) {
    changeClass(tile, "opened", "unopened");
    return true;
  }
};


const checkTileAndNeighbours = (tile) => {
  // Check the surrounding tile recursion function
  const checkNextTile = (row, col) => {
    if (typeof catsArray[row] !== 'undefined' && typeof catsArray[row][col] !== 'undefined') {
      const nextTile = table.rows[row].cells[col];
      if (nextTile.classList.contains("unopened") && !nextTile.classList.contains("flagged")) {
        checkTileAndNeighbours(nextTile);
      }
    }
  };

  const indexArray = indexTile(tile);
  const row = indexArray[0];
  const col = indexArray[1];
  const noCatNeighbours = checkForNeighbouringCats(tile);
  if (noCatNeighbours === true) {
    checkNextTile(row, col - 1);
    checkNextTile(row, col + 1);
    checkNextTile(row - 1, col);
    checkNextTile(row + 1, col);
    checkNextTile(row + 1, col + 1);
    checkNextTile(row - 1, col + 1);
    checkNextTile(row + 1, col - 1);
    checkNextTile(row - 1, col - 1);
  }
};

let time = 1;
const timer = document.querySelector("#timer");

const updateTimer = () => {
  if (playing === false) {
    return false;
  }
  if (time < 10) {
    timer.innerHTML = `00${time}`;
  } else if (time < 100) {
    timer.innerHTML = `0${time}`;
  } else if (time < 1000) {
    timer.innerHTML = `${time}`;
  }
  time += 1;
};

const startTimer = () => {
  setInterval(updateTimer, 1000);
};


// Cats left counter
const flagsLeftCounter = document.querySelector("#flags-left");
let flagsLeft = cats;

const setFlagsCounter = () => {
  if (cats < 10) {
    flagsLeftCounter.innerHTML = `00${cats}`;
  } else if (cats < 100) {
    flagsLeftCounter.innerHTML = `0${cats}`;
  } else {
    flagsLeftCounter.innerHTML = `${cats}`;
  }
};

setFlagsCounter();

const updateFlagsCounter = () => {
  if (flagsLeft > -1) {
    if (flagsLeft < 10) {
      flagsLeftCounter.innerHTML = `00${flagsLeft}`;
    } else if (flagsLeft < 100) {
      flagsLeftCounter.innerHTML = `0${flagsLeft}`;
    } else if (flagsLeft < 1000) {
      flagsLeftCounter.innerHTML = `${flagsLeft}`;
    }
  } else if (flagsLeft < 0) {
    if (flagsLeft > -10) {
      flagsLeftCounter.innerHTML = `-0${-1 * flagsLeft}`;
    } else {
      flagsLeftCounter.innerHTML = `-${-1 * flagsLeft}`;
    }
  }
};

// Check if the user has won the game
const checkIfWon = () => {
  let won = true;

  tdAll.forEach((tile) => {
    const indexArray = indexTile(tile);
    const row = indexArray[0];
    const col = indexArray[1];

    if ((tile.classList.contains("unopened") || tile.classList.contains("flagged")) && catsArray[row][col] !== 1) {
      won = false;
      return won;
    }
  });
  return won;
};

// Add toys to all cats when won
const addFlagsWhenWon = () => {
  tdAll.forEach((tile) => {
    const indexArray = indexTile(tile);
    const row = indexArray[0];
    const col = indexArray[1];

    if (catsArray[row][col] === 1) {
      changeClass(tile, "flagged", "unopened");
    }
  });
};

// Show all cats when game over
const addCatsWhenGameOver = () => {
  tdAll.forEach((tile) => {
    const indexArray = indexTile(tile);
    const row = indexArray[0];
    const col = indexArray[1];

    if (catsArray[row][col] === 1) {
      changeClass(tile, "cat", "unopened");
    }
  });
};

// --------- Event listeners on all tiles -----------------
tdAll.forEach((tile) => {
  // right click event listener
  tile.addEventListener("contextmenu", (event) => {
    event.preventDefault();

    // if tile contains toy already, remove the toy
    if (playing || newGame) {
      if (tile.classList.contains("flagged")) {
        changeClass(tile, "unopened", "flagged");
        flagsLeft += 1;
        updateFlagsCounter();
        // if its unopened without toy, add toy
      } else if (tile.classList.contains("unopened")) {
        changeClass(tile, "flagged", "unopened");
        flagsLeft -= 1;
        updateFlagsCounter();
      }
    }
  }, false);

  // mouse down event listener
  tile.addEventListener("mousedown", (_event) => {
    if (tile.classList.contains("unopened") && (playing || newGame)) {
      bubble.innerText = "Hmm..";
    }
  });

  // mouse up event listener
  tile.addEventListener("mouseup", (_event) => {
    if (tile.classList.contains("unopened") && (playing || newGame)) {
      bubble.innerText = "Choose a tile";
    }
  });

  // left click event listener
  tile.addEventListener("click", (event) => {
    event.preventDefault();

    if (newGame) {
      if (!playing) {
        startTimer();
        createCatsArray(tile);
      }
      playing = true;

      // check if tiles has a cat
      const indexArray = indexTile(tile);
      const row = indexArray[0];
      const col = indexArray[1];
      if (catsArray[row][col] === 1 && !tile.classList.contains("flagged")) {
        addCatsWhenGameOver();
        bubble.innerText = "Game over!";
        timer.classList.add("bounce-effect");
        timer.classList.add("bg-red");
        playing = false;
        newGame = false;
      } else if (tile.classList.contains("unopened") && !tile.classList.contains("flagged")) {
        checkTileAndNeighbours(tile);

        if (checkIfWon()) {
          addFlagsWhenWon();
          bubble.innerText = "You won!";
          timer.classList.add("bounce-effect");
          timer.classList.add("bg-blue");
          playing = false;
          newGame = false;
        }
      }
    }
  });
});
