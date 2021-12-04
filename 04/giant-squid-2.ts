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

type BoardWin = {
    board: number;
    number: number;
    round: number;
    score: number;
    multipliedScore: number;
};

function findWinningBoardRounds(boards: Board[], numbers: number[]): BoardWin[] {

    const boardWinRound: BoardWin[] = []
    const winningRounds: number[] = []

    boards.forEach((board, index) => {
        for (const number of numbers) {
            updateBoard(board, number);
            if (boardWon(board)) {
                const score = getBoardScore(board)
                const round: number = numbers.findIndex(x => x === number)
                winningRounds.push(round)
                boardWinRound.push({
                    board: index,
                    number: number,
                    round: round,
                    score: score,
                    multipliedScore: number * score
                })
                break;
            }
        }
    })

    return boardWinRound
}

const { boards, numbers } = parseInput(f)
const boardWinRound = findWinningBoardRounds(boards, numbers)

const maxRound = Math.max.apply(Math, boardWinRound.map(function (o) { return o.round; }))
console.log(maxRound)

let item1 = boardWinRound.find(i => i.round === maxRound);
console.log(item1)