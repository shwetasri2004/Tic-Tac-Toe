const cells = document.querySelectorAll('.cell');
const statusBtn = document.getElementById('status-btn');
const setupScreen = document.getElementById('setup-screen');
const board = document.getElementById('board');
const controls = document.getElementById('controls');

let playerSymbol = "X";
let computerSymbol = "O";    //If you use const, the browser will throw an error and the game will crash
//  because you cannot change the player's turn or the board's state once they are set.
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = false;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],   //winning conditions
    [0, 4, 8], [2, 4, 6]
];

function startGame(choice) {
    playerSymbol = choice;
    computerSymbol = choice === "X" ? "O" : "X";
    setupScreen.style.display = "none";
    board.style.display = "grid";
    controls.style.display = "flex";
    gameActive = true;
    currentPlayer = "X";
    
    if (computerSymbol === "X") {
        setTimeout(computerMove, 600);
    }
    updateStatus();
}

// SMART COMPUTER LOGIC
function computerMove() {
    if (!gameActive) return;

    //  Check karein kya Computer khud JEET sakta hai?
    let move = findBestMove(computerSymbol);
    
    // Agar nahi, toh check karein kya User jeet raha hai? Use BLOCK karein.
    if (move === null) {
        move = findBestMove(playerSymbol);
    }

    // 3. Agar kuch nahi mil raha, toh center ya random spot lein
    if (move === null) {
        if (gameState[4] === "") move = 4; // Center is best
        else {
            let available = gameState.map((v, i) => v === "" ? i : null).filter(v => v !== null);
            move = available[Math.floor(Math.random() * available.length)];
        }
    }

    const targetCell = document.querySelector(`[data-index="${move}"]`);
    updateCell(targetCell, move, computerSymbol);
}

// Dimag wala function: Ye dekhta hai ki 2 marks ke baad 3rd khali hai ya nahi
function findBestMove(symbol) {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        const values = [gameState[a], gameState[b], gameState[c]];
        
        // Agar 2 jagah symbol hai aur 1 khali hai
        if (values.filter(v => v === symbol).length === 2 && values.filter(v => v === "").length === 1) {
            if (gameState[a] === "") return a;
            if (gameState[b] === "") return b;
            if (gameState[c] === "") return c;
        }
    }
    return null;
}

function updateCell(cell, index, symbol) {
    gameState[index] = symbol;
    cell.innerText = symbol;
    cell.classList.add(symbol.toLowerCase());
    
    if (checkWinner(symbol)) {
        statusBtn.innerText = symbol === playerSymbol ? "You Won! 🎉" : "Computer Won! 🤖";
        gameActive = false;
    } else if (!gameState.includes("")) {
        statusBtn.innerText = "It's a Draw! 🤝";
        gameActive = false;
    } else {
        currentPlayer = (symbol === "X") ? "O" : "X";
        updateStatus();
    }
}

function checkWinner(symbol) {
    return winningConditions.some(cond => cond.every(i => gameState[i] === symbol));
}

function updateStatus() {
    if (gameActive) {
        statusBtn.innerText = currentPlayer === playerSymbol ? "Your Turn" : "Computer's Turn";
    }
}

function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');
    if (gameState[index] !== "" || !gameActive || currentPlayer !== playerSymbol) return;
    
    updateCell(e.target, index, playerSymbol);
    if (gameActive) setTimeout(computerMove, 600);
}

function resetGame() { location.reload(); }
cells.forEach(cell => cell.addEventListener('click', handleCellClick));