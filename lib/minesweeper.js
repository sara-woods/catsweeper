let playing = false;
let newGame = true;

// Speech bubble
const bubble = document.querySelector("#message");

// Generate tiles
const numTilesRow = 15;
const numTilesCol = 15;

const generateTiles = (row, col) => {
  const table = document.querySelector("#minesweeper");

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

// set number of bombs
const bombsRatio = 0.1;
const bombs = Math.round(bombsRatio * (numTilesCol * numTilesRow));

// create grid/tiles array
const createTilesArray = () => {
  const tilesArray = [];
  for (let i = 0; i < numTilesRow; i += 1) {
    tilesArray[i] = new Array(numTilesCol).fill(0);
  }
  return tilesArray;
};

// create  random  integer
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min) + min);
};

// place bombs randomly in grid 2d array
const createMinesArray = () => {
  const minesArray = createTilesArray();
  let j = 0;
  let r;
  let r2;
  while (j < bombs) {
    r = getRandomInt(0, numTilesRow);
    r2 = getRandomInt(0, numTilesCol);
    if (minesArray[r][r2] !== 1) {
      minesArray[r][r2] = 1;
      j += 1;
    }
  }
  return minesArray;
};

const minesArray = createMinesArray();

// index the tile
const indexTile = (tile) => {
  const rowIndex = tile.parentElement.rowIndex;
  const cellIndex = tile.cellIndex;
  return [rowIndex, cellIndex];
};

// add and remove class name
const changeClass = (tile, name, remove) => {
  tile.classList.add(name);
  tile.classList.remove(remove);
};


// Select all tiles
const tdAll = document.querySelectorAll("td");
const table = document.getElementById('minesweeper');


// Show all mines when game over
const addBombsWhenGameOver = () => {
  tdAll.forEach((tile) => {
    const indexArray = indexTile(tile);
    const row = indexArray[0];
    const col = indexArray[1];

    if (minesArray[row][col] === 1) {
      changeClass(tile, "mine", "unopened");
    }
  });
};

// Add flags to all mines when won
const addFlagsWhenWon = () => {
  tdAll.forEach((tile) => {
    const indexArray = indexTile(tile);
    const row = indexArray[0];
    const col = indexArray[1];

    if (minesArray[row][col] === 1) {
      changeClass(tile, "flagged", "unopened");
    }
  });
};


const checkIfBombOnTile = (row, col, b) => {
  // Does tile exist?
  if (minesArray[row] && minesArray[row][col]) {
    if (minesArray[row][col] === 1) {
      b += 1;
    }
  }
  return b;
};


const checkNeighbouringBombs = (tile) => {
  const indexArray = indexTile(tile);
  const row = indexArray[0];
  const col = indexArray[1];
  let b = 0;

  b = checkIfBombOnTile(row, col - 1, b);
  b = checkIfBombOnTile(row, col + 1, b);
  b = checkIfBombOnTile(row - 1, col, b);
  b = checkIfBombOnTile(row + 1, col, b);
  b = checkIfBombOnTile(row + 1, col + 1, b);
  b = checkIfBombOnTile(row - 1, col + 1, b);
  b = checkIfBombOnTile(row + 1, col - 1, b);
  b = checkIfBombOnTile(row - 1, col - 1, b);

  changeClass(tile, `mine-neighbour-${b}`, "unopened");

  if (b === 0) {
    changeClass(tile, "opened", "unopened");
    return true;
  }
};

const checkNextTile = (row, col) => {
  if (typeof minesArray[row] !== 'undefined' && typeof minesArray[row][col] !== 'undefined') {
    const nextTile = table.rows[row].cells[col];
    if (nextTile.classList.contains("unopened") && !nextTile.classList.contains("flagged")) {
      checkTileAndNeighbours(nextTile);
    }
  }
};

const checkTileAndNeighbours = (tile) => {
  const indexArray = indexTile(tile);
  const row = indexArray[0];
  const col = indexArray[1];
  const noBombNeighbours = checkNeighbouringBombs(tile);
  if (noBombNeighbours === true) {
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


// bombs left counter
const flagsLeftCounter = document.querySelector("#bombs-left");
let flagsLeft = bombs;

const setFlagsCounter = () => {
  if (bombs < 10) {
    flagsLeftCounter.innerHTML = `00${bombs}`;
  } else if (bombs < 100) {
    flagsLeftCounter.innerHTML = `0${bombs}`;
  } else {
    flagsLeftCounter.innerHTML = `${bombs}`;
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

const checkIfWon = () => {
  let won = true;

  tdAll.forEach((tile) => {
    const indexArray = indexTile(tile);
    const row = indexArray[0];
    const col = indexArray[1];

    if ((tile.classList.contains("unopened") || tile.classList.contains("flagged")) && minesArray[row][col] !== 1) {
      won = false;
      return won;
    }
  });
  return won;
};


tdAll.forEach((tile) => {
  // right click event listener
  tile.addEventListener("contextmenu", (event) => {
    event.preventDefault();

    // if tile contains flag already, remove the flag
    if (playing || newGame) {
      if (tile.classList.contains("flagged")) {
        changeClass(tile, "unopened", "flagged");
        flagsLeft += 1;
        updateFlagsCounter();
        // if its unopened without flag, add flag
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
      }
      playing = true;

      // check if tiles is a bomb
      const indexArray = indexTile(tile);
      const row = indexArray[0];
      const col = indexArray[1];
      if (minesArray[row][col] === 1 && !tile.classList.contains("flagged")) {
        addBombsWhenGameOver();
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
