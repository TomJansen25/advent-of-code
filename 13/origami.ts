import { readFileSync } from 'fs';

const input: string = readFileSync('input.txt', 'utf-8')

const testInput: string = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`


function parseFile(f: string) {
    const [rawCoordinates, rawFolds] = f.split("\n\n")

    const coordinates: number[][] = rawCoordinates.split('\n').map((line) => line.split(',').map(Number))
    const folds: string[] = rawFolds.split('\n')

    const maxCol: number = Math.max.apply(Math, coordinates.map((o) => o[0]))
    const maxRow: number = Math.max.apply(Math, coordinates.map((o) => o[1]))

    return { coordinates, maxCol, maxRow, folds }
}

type Paper = number[][]

function fillPaper(paper: Paper, coordinates: number[][]) {
    coordinates.forEach((coordinate: number[]) => {
        // console.log(coordinate)
        const x: number = coordinate[0]
        const y: number = coordinate[1]
        paper[y][x] = 1
    })
    return paper
}

function countDots(paper: Paper): number {
    let score: number = 0
    paper.forEach((row) => {
        row.forEach((dot) => {
            if (dot === 1) score++
        })
    })
    return score;
}

function foldPaper(instructions: string[], paper: number[][]): { score: number, paper: Paper } {

    let score: number = 0

    instructions.forEach((instruction: string) => {

        const line: number = Number(instruction.split('=')[1])

        if (instruction.includes('y')) {
            console.log(`Fold along y-axis at line = ${line}`)

            let newCoordinates: number[][] = []

            paper.forEach((row, rowIndex) => {
                row.forEach((dot, colIndex) => {
                    if (dot === 1 && rowIndex > line) {
                        const newRowIndex = line - (rowIndex - line)
                        newCoordinates.push([colIndex, newRowIndex])
                    }
                })
            })

            paper = paper.slice(0, line)
            paper = fillPaper(paper, newCoordinates)
            score = countDots(paper)
            console.log(score)

        } else {
            console.log(`Fold along x-axis at line = ${line}`)

            let newCoordinates: number[][] = []

            paper.forEach((row, rowIndex) => {
                row.forEach((dot, colIndex) => {
                    if (dot === 1 && colIndex > line) {
                        const newColIndex = line - (colIndex - line)
                        newCoordinates.push([newColIndex, rowIndex])
                    }
                })
            })

            paper = fillPaper(paper, newCoordinates)

            paper.forEach((row, rowIndex) => {
                paper[rowIndex] = paper[rowIndex].slice(0, line)
            })
            score = countDots(paper)
            console.log(score)
        }
    })
    return { score, paper }

}

function main(input: string) {
    const { coordinates, maxCol, maxRow, folds } = parseFile(input)
    // console.log(coordinates)
    console.log(folds)
    console.log(maxCol, maxRow)

    // Initialize an empty paper with retrieved dimensions
    let paper: number[][] = new Array<number>(maxRow + 1).fill(0).map(() =>
        new Array<number>(maxCol + 1).fill(0)
    )

    paper = fillPaper(paper, coordinates)

    const res = foldPaper(folds, paper)
    console.log(res.score)
    console.log(res.paper)

}

main(input)
