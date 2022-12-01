import { readFileSync } from 'fs';

const input = readFileSync('input.txt', 'utf-8');
const heatmap: number[][] = input.split("\n").map(line => line.split("").map(Number))

let f: string[] = ['2199943210', '3987894921', '9856789892', '8767896789', '9899965678']
// const heatmap = f.map(line => line.split("").map(Number))

const maxRow: number = heatmap.length - 1
const maxCol: number = heatmap[0].length - 1

// console.log(maxRow, maxCol)

function getNeighbors(x: number, y: number) {

    let neighbors: number[][] = [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
    ]

    if (y === maxRow) {
        neighbors.splice(3, 1)
    }
    if (y === 0) {
        neighbors.splice(2, 1)
    }
    if (x === maxCol) {
        neighbors.splice(1, 1)
    }
    if (x === 0) {
        neighbors.splice(0, 1)
    }


    return neighbors
}

function findLowPoints(heatmap: number[][]) {

    let lowestPoints: number[] = []

    heatmap.forEach((line, row) => {
        line.forEach((point, column) => {
            // console.log(column, row)
            const neighborCoordinates = getNeighbors(column, row)
            const neighbors: number[] = []
            neighborCoordinates.forEach((coordinate: number[]) => {
                neighbors.push(heatmap[coordinate[1]][coordinate[0]])
            })
            // console.log(point, neighbors)
            if (neighbors.every(n => point < n)) {
                lowestPoints.push(point)
            }
        })
    })

    return lowestPoints
}

async function main() {
    const lowestPoints: number[] = findLowPoints(heatmap)
    console.log(lowestPoints.reduce((memo, val) => memo + val + 1, 0))
}

main()

//const neighbors: number[] = [3, 5, 9]
//console.log(neighbors.every(n => 2 < n))