document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const currentPlayerDisplay = document.getElementById('currentPlayerDisplay');
    const currentPlayerText = document.getElementById('currentPlayer');
    const setupElement = document.getElementById('setup');
    const rouletteElement = document.getElementById('roulette');
    const rouletteResultElement = document.getElementById('rouletteResult');
    const gameElement = document.getElementById('game');
    const cells = Array(9).fill(null);
    let currentPlayer = '○';
    let playerX = '';
    let playerO = '';
    let clearColor = 'red';
    const moves = { '○': [], '✕': [] };

    function startGame() {
        playerX = document.getElementById('playerX').value;
        playerO = document.getElementById('playerO').value;
        clearColor = document.getElementById('clearColor').value;

        if (playerX === '' || playerO === '') {
            alert('プレイヤー名を入力してください');
            return;
        }

        setupElement.classList.add('hidden');
        rouletteElement.classList.remove('hidden');
    }

    function startRoulette() {
        rouletteResultElement.textContent = 'ルーレット中...';
        rouletteResultElement.classList.add('roulette-spin');
        setTimeout(determineFirstPlayer, 2000);
    }

    function determineFirstPlayer() {
        rouletteResultElement.classList.remove('roulette-spin');
        const players = ['○', '✕'];
        currentPlayer = players[Math.floor(Math.random() * players.length)];
        rouletteResultElement.textContent = `${getCurrentPlayerName()} (${currentPlayer}) が先手です！`;

        setTimeout(() => {
            rouletteElement.classList.add('hidden');
            gameElement.classList.remove('hidden');
            updateCurrentPlayerDisplay();
            createBoard();
        }, 2000);
    }

    function createBoard() {
        boardElement.innerHTML = ''; // ボードを初期化
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        }
    }

    function handleCellClick(event) {
        const index = event.target.dataset.index;

        if (cells[index] === null) {
            if (moves[currentPlayer].length === 3) {
                const oldMoveIndex = moves[currentPlayer][0];
                document.querySelector(`.cell[data-index='${oldMoveIndex}']`).classList.remove('next-to-clear', 'red', 'black');
            }

            event.target.textContent = currentPlayer;
            cells[index] = currentPlayer;
            moves[currentPlayer].push(index);

            if (moves[currentPlayer].length > 3) {
                const oldMoveIndex = moves[currentPlayer].shift();
                cells[oldMoveIndex] = null;
                document.querySelector(`.cell[data-index='${oldMoveIndex}']`).textContent = '';
            }

            if (moves[currentPlayer].length === 3) {
                const nextToClearIndex = moves[currentPlayer][0];
                document.querySelector(`.cell[data-index='${nextToClearIndex}']`).classList.add('next-to-clear', clearColor);
            }

            if (checkWin(currentPlayer)) {
                alert(`${getCurrentPlayerName()}の勝ち！`);
                resetGame();
            } else if (cells.every(cell => cell !== null)) {
                alert('引き分け！');
                resetGame();
            } else {
                currentPlayer = currentPlayer === '○' ? '✕' : '○';
                updateCurrentPlayerDisplay();
                flipDisplay();
            }
        }
    }

    function checkWin(player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winPatterns.some(pattern => pattern.every(index => cells[index] === player));
    }

    function resetGame() {
        cells.fill(null);
        moves['○'] = [];
        moves['✕'] = [];
        currentPlayer = '○';
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('next-to-clear', 'red', 'black');
        });
        setupElement.classList.remove('hidden');
        gameElement.classList.add('hidden');
        rouletteElement.classList.add('hidden');
    }

    function getCurrentPlayerName() {
        return currentPlayer === '○' ? playerO : playerX;
    }

    function updateCurrentPlayerDisplay() {
        currentPlayerText.textContent = `現在のプレイヤー: ${getCurrentPlayerName()} (${currentPlayer})`;
    }

    function flipDisplay() {
        currentPlayerDisplay.classList.toggle('flipped');
    }

    window.startGame = startGame;
    window.startRoulette = startRoulette;
});