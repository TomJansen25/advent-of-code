import { readFileSync } from 'fs';

const f = readFileSync('input.txt', 'utf-8');

function parseInput(rawInput: string) {
    const [rawNumbers, ...rawBoards] = rawInput.split("\n\n")

    const numbers = rawNumbers.split(",").map(Number)
    const boards = rawBoards.map((rawBoard) =>
        rawBoard.split("\n").map((line) =>
            line
                .split(" ")
                .filter((x) => x.trim().length !== 0)
                .map(Number),
        ),
    )

    return { boards, numbers }
}

type Board = (number | null)[][];

function updateBoard(board: Board, n: number) {
    board.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === n) {
                board[y][x] = null;
            }
        });
    });
}

function boardWon(board: Board) {
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
            if (cell !== null) {
                score = score + cell;
            }
        });
    });
    return score;
}

function findWinningBoard(boards: Board[], numbers: number[]) {
    for (const number of numbers) {
        for (const board of boards) {
            updateBoard(board, number);
            if (boardWon(board)) {
                const score = getBoardScore(board)
                console.log(`Last number = ${number}, board score = ${score}. Multiplication = ${number * score}.`)
                return { board, number }
            }
        }
    }
}

const { boards, numbers } = parseInput(f)

findWinningBoard(boards, numbers)