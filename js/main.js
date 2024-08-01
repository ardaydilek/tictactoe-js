class TicTacToe {
  constructor(playerSymbol) {
    this.board = Array(9).fill("");
    this.playerSymbol = playerSymbol;
    this.computerSymbol = playerSymbol === "X" ? "O" : "X";
    this.currentTurn = "X";
    this.winner = null;
    this.winningLine = null;
  }

  makeMove(index) {
    if (this.board[index] === "" && !this.winner) {
      this.board[index] = this.currentTurn;
      this.checkWin();
      if (!this.winner) {
        this.currentTurn = this.currentTurn === "X" ? "O" : "X";
      }
      return true;
    }
    return false;
  }

  checkWin() {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    for (let condition of winConditions) {
      const [a, b, c] = condition;
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        this.winner = this.board[a];
        this.winningLine = condition;
        return;
      }
    }

    if (!this.board.includes("")) {
      this.winner = "T"; // Tie
    }
  }

  computerMove() {
    // Simple AI: First try to win, then block player, then random move
    const move =
      this.findBestMove(this.computerSymbol) ||
      this.findBestMove(this.playerSymbol) ||
      this.getRandomEmptyCell();

    if (move !== null) {
      this.makeMove(move);
    }
  }

  findBestMove(symbol) {
    for (let i = 0; i < 9; i++) {
      if (this.board[i] === "") {
        this.board[i] = symbol;
        if (this.checkWinningMove()) {
          this.board[i] = "";
          return i;
        }
        this.board[i] = "";
      }
    }
    return null;
  }

  checkWinningMove() {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let [a, b, c] of winConditions) {
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        return true;
      }
    }
    return false;
  }

  getRandomEmptyCell() {
    const emptyCells = this.board.reduce((acc, cell, index) => {
      if (cell === "") acc.push(index);
      return acc;
    }, []);

    if (emptyCells.length === 0) return null;
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }
}

class TicTacToeUI {
  constructor(game) {
    this.game = game;
    this.boardElement = document.querySelector(".game_container_board");
    this.turnButton = document.getElementById("turnButton");
    this.scoreYou = document.querySelector(".game_container_score_button.you");
    this.scoreCpu = document.querySelector(".game_container_score_button.cpu");
    this.scoreTies = document.querySelector(
      ".game_container_score_button.ties"
    );
    this.scoreInfoYou = document.querySelector(
      ".game_container_score_button.you p.you_span"
    );
    this.scoreInfoCpu = document.querySelector(
      ".game_container_score_button.cpu p.cpu_span"
    );
    this.history = [];
    this.initBoard();
    this.updateScoreDisplay();
  }

  initBoard() {
    this.boardElement.innerHTML = "";
    for (let i = 0; i < 9; i++) {
      const button = document.createElement("button");
      button.classList.add("game_container_board_item");
      button.addEventListener("click", () => this.onCellClick(i));
      this.boardElement.appendChild(button);
    }
    this.updateTurnDisplay();
  }

  onCellClick(index) {
    if (this.game.makeMove(index)) {
      this.updateBoard();
      if (this.game.winner) {
        this.handleGameEnd();
      } else if (this.game.currentTurn === this.game.computerSymbol) {
        setTimeout(() => {
          this.game.computerMove();
          this.updateBoard();
          if (this.game.winner) {
            this.handleGameEnd();
          }
        }, 500); // Delay for better UX
      }
    }
  }

  updateBoard() {
    const cells = this.boardElement.children;
    for (let i = 0; i < 9; i++) {
      cells[i].textContent = this.game.board[i];
      cells[i].classList.remove("winning-cell");
    }
    if (this.game.winningLine) {
      for (let index of this.game.winningLine) {
        cells[index].classList.add("winning-cell");
      }
    }
    this.updateTurnDisplay();
  }

  updateTurnDisplay() {
    this.turnButton.querySelector("svg").innerHTML =
      this.game.currentTurn === "X"
        ? '<path fill-rule="evenodd" clip-rule="evenodd" d="M27.681 1.63437C26.5094 0.462798 24.6099 0.4628 23.4383 1.63437L16 9.07271L8.56166 1.63437C7.39009 0.462798 5.49059 0.4628 4.31902 1.63437L1.63437 4.31902C0.462799 5.49059 0.462801 7.39009 1.63437 8.56166L9.07271 16L1.63437 23.4383C0.462798 24.6099 0.4628 26.5094 1.63437 27.681L4.31902 30.3656C5.49059 31.5372 7.39009 31.5372 8.56166 30.3656L16 22.9273L23.4383 30.3656C24.6099 31.5372 26.5094 31.5372 27.681 30.3656L30.3656 27.681C31.5372 26.5094 31.5372 24.6099 30.3656 23.4383L22.9273 16L30.3656 8.56166C31.5372 7.39009 31.5372 5.49059 30.3656 4.31902L27.681 1.63437Z" fill="currentColor"/>'
        : '<path fill-rule="evenodd" clip-rule="evenodd" d="M31.9704 15.8706C31.9704 7.10551 24.8649 0 16.0998 0C7.33476 0 0.229248 7.10551 0.229248 15.8706C0.229248 24.6357 7.33476 31.7412 16.0998 31.7412C24.8649 31.7412 31.9704 24.6357 31.9704 15.8706ZM9.63405 15.8706C9.63405 12.2996 12.5289 9.4048 16.0998 9.4048C19.6708 9.4048 22.5656 12.2996 22.5656 15.8706C22.5656 19.4416 19.6708 22.3364 16.0998 22.3364C12.5289 22.3364 9.63405 19.4416 9.63405 15.8706Z" fill="currentColor"/>';
  }

  handleGameEnd() {
    this.history.push(this.game.winner);
    this.updateScoreDisplay();
    setTimeout(() => {
      alert(
        this.game.winner === "T" ? "It's a tie!" : `${this.game.winner} wins!`
      );
      this.resetGame();
    }, 100);
  }

  resetGame() {
    this.game = new TicTacToe(this.game.playerSymbol);
    this.initBoard();
    if (this.game.playerSymbol === "O") {
      this.game.computerMove();
      this.updateBoard();
    }
  }

  updateScoreDisplay() {
    this.scoreInfoYou.innerText = this.game.playerSymbol === "X" ? "X" : "O";
    this.scoreInfoCpu.innerText = this.game.computerSymbol === "X" ? "X" : "O";
    const xWins = this.history.filter((w) => w === "X").length;
    const oWins = this.history.filter((w) => w === "O").length;
    const ties = this.history.filter((w) => w === "T").length;

    if (this.game.playerSymbol === "X") {
      this.scoreYou.querySelector("span").textContent = xWins;
      this.scoreCpu.querySelector("span").textContent = oWins;
    } else {
      this.scoreYou.querySelector("span").textContent = oWins;
      this.scoreCpu.querySelector("span").textContent = xWins;
    }
    this.scoreTies.querySelector("span").textContent = ties;
  }
}

function initIndex() {
  let playerPick = localStorage.getItem("playerPick") || "X";
  const x = document.getElementById("x");
  const o = document.getElementById("o");
  const playButton = document.getElementById("playButton");

  function updateActiveButton() {
    x.classList.toggle("active", playerPick === "X");
    o.classList.toggle("active", playerPick === "O");
  }

  x.addEventListener("click", () => {
    playerPick = "X";
    localStorage.setItem("playerPick", playerPick);
    updateActiveButton();
  });

  o.addEventListener("click", () => {
    playerPick = "O";
    localStorage.setItem("playerPick", playerPick);
    updateActiveButton();
  });

  playButton.addEventListener("click", () => {
    window.location.href = "game.html";
  });

  updateActiveButton();
}

function initGame() {
  const playerPick = localStorage.getItem("playerPick") || "X";
  const game = new TicTacToe(playerPick);
  const ui = new TicTacToeUI(game);

  if (playerPick === "O") {
    setTimeout(() => {
      game.computerMove();
      ui.updateBoard();
    }, 500);
  }
}

function init() {
  if (document.querySelector(".game_container")) {
    initGame();
  } else {
    initIndex();
  }
}

document.addEventListener("DOMContentLoaded", init);
