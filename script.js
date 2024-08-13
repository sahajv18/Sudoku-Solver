var arr = [[], [], [], [], [], [], [], [], []];

for (var i = 0; i < 9; i++) {
	for (var j = 0; j < 9; j++) {
		arr[i][j] = document.getElementById(i * 9 + j);
	}
}

var board = [[], [], [], [], [], [], [], [], []];

function FillBoard(board) {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			if (board[i][j] != 0) {
				arr[i][j].innerText = board[i][j];
			} else {
				arr[i][j].innerText = '';
			}
		}
	}
}

let GetPuzzle = document.getElementById('GetPuzzle');
let SolvePuzzle = document.getElementById('SolvePuzzle');

GetPuzzle.onclick = function () {
	var xhrRequest = new XMLHttpRequest();
	xhrRequest.onload = function () {
		var response = JSON.parse(xhrRequest.response);
		console.log(response);
		board = response.board;
		FillBoard(board);
	};
	xhrRequest.open('get', 'https://sugoku.onrender.com/board?difficulty=easy');
	// We can change the difficulty of the puzzle: easy, medium, hard, or random
	xhrRequest.send();
};

SolvePuzzle.onclick = () => {
	sudokuSolver(board, 0, 0, 9);
};

function isSafe(board, row, col, val, n) {
	for (let i = 0; i < n; i++) {
		// Row and column check
		if (board[row][i] == val || board[i][col] == val) return false;
	}

	// Submatrix check
	let rn = Math.sqrt(n);
	let si = row - (row % rn);
	let sj = col - (col % rn);
	for (let x = si; x < si + rn; x++) {
		for (let y = sj; y < sj + rn; y++) {
			if (board[x][y] == val) {
				return false;
			}
		}
	}
	return true;
}

function sudokuSolver(board, row, col, n) {
	// Base case
	if (row == n) {
		FillBoard(board);
		return true;
	}

	// If we're at the last column, move to the next row
	if (col == n) {
		return sudokuSolver(board, row + 1, 0, n);
	}

	// If the cell is already filled, move to the next column
	if (board[row][col] != 0) {
		return sudokuSolver(board, row, col + 1, n);
	}

	for (let val = 1; val <= 9; val++) {
		// Check if val is safe to place
		if (isSafe(board, row, col, val, n)) {
			board[row][col] = val;
			// Recursive call
			let isPossible = sudokuSolver(board, row, col + 1, n);
			if (isPossible) {
				return true;
			}
			// Backtracking
			board[row][col] = 0;
		}
	}
	return false;
}
