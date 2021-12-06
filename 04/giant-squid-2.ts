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
            if (cell !== null) score = score + cell;
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

const { boards, draws } = parseFile(f)
const boardWinRound = findWinningBoardRounds(boards, draws)

const maxRound = Math.max.apply(Math, boardWinRound.map(function (r) { return r.round; }))
console.log(maxRound)

const lastBoard = boardWinRound.find(b => b.round === maxRound);
console.log(lastBoard)