import { readFileSync } from 'fs';

const f = readFileSync('input.txt', 'utf-8');

function parseFile(f: string) {
    const [rawDraws, ...rawBoards] = f.split("\n\n")

    const draws = rawDraws.split(",").map(Number)
    const boards = rawBoards.map((rawBoard) =>
        rawBoard.split("\n").map((line) => line.split(" ").filter(
            (x) => x.trim().length !== 0).map(Number))
    )

    return { boards, draws }
}

type Board = (number | null)[][];

function updateBoard(board: Board, n: number) {
    board.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            if (cell === n) board[rowIndex][cellIndex] = null;
        });
    });
}

function hasBoardWon(board: Board) {
    for (const line of board) {
        if (line.every((value) => value === null)) return true;
    }
    for (let i = 0; i < board[0].length; i++) {
        if (board.every((line) => line[i] === null)) return true;
    }
    return false
}

function getBoardScore(board: Board): number {
    let score: number = 0
    board.forEach((row) => {
        row.forEach((cell) => {
            if (cell !== null) score = score + cell;
        });
    });
    return score;
}

function findWinningBoard(boards: Board[], draws: number[]) {
    for (const draw of draws) {
        for (const board of boards) {
            updateBoard(board, draw);
            if (hasBoardWon(board)) {
                const score = getBoardScore(board)
                console.log(`Last draw = ${draw}, board score = ${score}. Multiplication = ${draw * score}.`)
                return { board, draw }
            }
        }
    }
}

const { boards, draws } = parseFile(f)
findWinningBoard(boards, draws)