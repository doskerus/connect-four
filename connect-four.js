/* Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a column
 * until a player gets four-in-a-row (horiz, vert or diag) or until board fills (tie)
 *
 */
const WIDTH = 7; // x
const HEIGHT = 6; // y

let currPlayer = 1; // active player: 1 or 2
// let nextPlayer = 2;
const board = []; // array of rows, each row is array of cells board[y][x]

/* makeBoard: create in-JS board structure: board = array of rows, each row is array of cells board[y][x] */
function makeBoard() {
	for (let y = 0; y < HEIGHT; y++) {
		const row = [];
		for (let x = 0; x < WIDTH; x++) {
			row.push(null);
		}
		board.push(row);
	}
}

/* makeHtmlBoard: make HTML table and row of column tops */
function makeHtmlBoard() {
	// make column tops (clickable area for adding a piece to that column)
	const headRow = document.createElement('tr');
	headRow.setAttribute('id', 'head-row'); // 'column-top' === 'head-row'!
	headRow.addEventListener('click', handleClick); // eventListener and handleClick!

	for (let x = 0; x < WIDTH; x++) {
		const headCell = document.createElement('th');
		headCell.setAttribute('id', x);
		headRow.append(headCell);
	}
	const htmlBoard = document.getElementById('board');
	htmlBoard.append(headRow);

	// make main part of board
	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr');

		for (let x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			row.append(cell);
		}
		htmlBoard.append(row);
	}
}

/* findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
	for (let y = HEIGHT - 1; y >= 0; y--) {
		if (!board[y][x]) return y;
	}
	return null;
}

/* placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
	const divPiece = document.createElement('div');
	divPiece.classList.add('piece', `p${currPlayer}`);

	const tdCell = document.getElementById(`${y}-${x}`);
	tdCell.append(divPiece);
}

/* checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
	// check four cells to see if they're all color of current player
	// • cells: list of four (y, x) cells
	// • returns true if all are legal coordinates & all match currPlayer
	function _win(cells) {
		return cells.every(([y, x]) =>
			y >= 0 &&
			y < HEIGHT &&
			x >= 0 &&
			x < WIDTH &&
			board[y][x] === currPlayer
		);
	}

	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			// get "check list" of 4 cells (starting here) for each of the different ways to win
			const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
			const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
			const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
			const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

			// find winner (only checking each win-possibility as needed)
			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) return true;
		}
	}
}

/* endGame: announce game end */
function endGame(msg) {
	setTimeout(() => { alert(msg); }, 0);
	// eventListener REMOVE!
	const headRow = document.getElementById('head-row');
	headRow.removeEventListener('click', handleClick);
}

/* handleClick: handle click of column top to play piece */
function handleClick(event) {
	// get x from ID of clicked cell
	const x = +event.target.id;

	// get next spot in column (if none, ignore click)
	const y = findSpotForCol(x);
	if (y === null) return;

	// place piece in board and add to HTML table
	board[y][x] = currPlayer;
	placeInTable(y, x);

	// check for win
	if (checkForWin()) return endGame(`Player ${currPlayer} won!`);

	// check for tie
	const checkForTie = board[0].every((cell) => cell);
	if (checkForTie) return endGame('The game is a tie!');

	// switch players 1 <-> 2
	// [currPlayer, nextPlayer] = [nextPlayer, currPlayer];
	currPlayer = currPlayer % 2 + 1;
}

// init
makeBoard();
makeHtmlBoard();
