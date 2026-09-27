const cells = document.querySelectorAll(".cell");

const statusText = document.getElementById("status");

const restartButton = document.getElementById("restart");

const xScoreText = document.getElementById("xScore");
const oScoreText = document.getElementById("oScore");

const popup = document.getElementById("winPopup");

const winnerText = document.getElementById("winnerText");
const winnerSubtext = document.getElementById("winnerSubtext");

const playAgainButton = document.getElementById("playAgain");


let currentPlayer = "X";

let gameActive = true;

let board = ["", "", "", "", "", "", "", ""];

let xScore = 0;
let oScore = 0;


/* WINNING COMBINATIONS */

const winningCombinations = [

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]

];


/* SOUND SYSTEM */

let audioContext;


function playSound(type) {

    if (!audioContext) {
        audioContext = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();
    }

    const oscillator = audioContext.createOscillator();

    const gain = audioContext.createGain();

    oscillator.connect(gain);

    gain.connect(audioContext.destination);


    if (type === "move") {

        oscillator.frequency.value = 500;

        gain.gain.value = 0.08;

        oscillator.type = "sine";

    }


    if (type === "win") {

        oscillator.frequency.value = 700;

        gain.gain.value = 0.12;

        oscillator.type = "sine";

    }


    if (type === "draw") {

        oscillator.frequency.value = 250;

        gain.gain.value = 0.08;

        oscillator.type = "triangle";

    }


    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 0.18
    );
}


/* CELL CLICK */

cells.forEach((cell, index) => {

    cell.addEventListener("click", () => {

        makeMove(cell, index);

    });

});


function makeMove(cell, index) {

    if (!gameActive || board[index] !== "") {
        return;
    }


    /* SOUND */

    playSound("move");


    /* PLACE X / O */

    board[index] = currentPlayer;

    cell.textContent = currentPlayer;


    if (currentPlayer === "X") {

        cell.classList.add("x");

    } else {

        cell.classList.add("o");

    }


    checkWinner();

}


/* CHECK WINNER */

function checkWinner() {

    for (const combination of winningCombinations) {

        const [a, b, c] = combination;


        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            /* HIGHLIGHT WIN */

            cells[a].classList.add("win");
            cells[b].classList.add("win");
            cells[c].classList.add("win");


            gameActive = false;


            /* SCORE */

            if (currentPlayer === "X") {

                xScore++;

                xScoreText.textContent = xScore;

            } else {

                oScore++;

                oScoreText.textContent = oScore;

            }


            /* WIN SOUND */

            playSound("win");


            /* SHOW POPUP */

            setTimeout(() => {

                showWinPopup(currentPlayer);

            }, 400);


            return;
        }
    }


    /* DRAW */

    if (!board.includes("")) {

        gameActive = false;

        playSound("draw");

        setTimeout(() => {

            showDrawPopup();

        }, 400);

        return;
    }


    /* NEXT PLAYER */

    currentPlayer =
        currentPlayer === "X" ? "O" : "X";


    statusText.textContent =
        "PLAYER " + currentPlayer + " TURN";

}


/* WIN POPUP */

function showWinPopup(player) {

    winnerText.textContent = "YOU WIN!";

    winnerSubtext.textContent =
        "PLAYER " + player + " WINS";


    popup.classList.add("show");

}


/* DRAW POPUP */

function showDrawPopup() {

    winnerText.textContent = "DRAW!";

    winnerSubtext.textContent =
        "NO WINNER THIS ROUND";


    popup.classList.add("show");

}


/* PLAY AGAIN */

playAgainButton.addEventListener("click", () => {

    popup.classList.remove("show");

    restartGame();

});


/* RESTART */

restartButton.addEventListener("click", restartGame);


function restartGame() {

    board = ["", "", "", "", "", "", "", ""];

    currentPlayer = "X";

    gameActive = true;


    statusText.textContent =
        "PLAYER X TURN";


    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove("x");

        cell.classList.remove("o");

        cell.classList.remove("win");

    });

}