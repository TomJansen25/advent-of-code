import { readFileSync } from 'fs';

const input = readFileSync('input.txt', 'utf-8');
const heatmap: number[][] = input.split("\n").map(line => line.split("").map(Number))

const maxRow: number = heatmap.length - 1
const maxCol: number = heatmap[0].length - 1

type Point = {
    x: number,
    y: number,
    height: number
}

type Basin = Point & {
    basinSize: number
}

function getNeighbors(x: number, y: number, heatmap: number[][]): Point[] {

    let neighborCoordinates: number[][] = [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
    ]

    if (y === maxRow) {
        neighborCoordinates.splice(3, 1)
    }
    if (y === 0) {
        neighborCoordinates.splice(2, 1)
    }
    if (x === maxCol) {
        neighborCoordinates.splice(1, 1)
    }
    if (x === 0) {
        neighborCoordinates.splice(0, 1)
    }

    let neighbors: Point[] = []

    neighborCoordinates.forEach((coordinate: number[]) => {
        const x: number = coordinate[0]
        const y: number = coordinate[1]
        neighbors.push({ x, y, height: heatmap[coordinate[1]][coordinate[0]] })
    })

    return neighbors
}

function findLowPoints(heatmap: number[][]) {

    let lowestPoints: Point[] = []

    heatmap.forEach((line, row) => {
        line.forEach((point, column) => {
            const p: Point = { x: column, y: row, height: point }
            const neighbors: Point[] = getNeighbors(column, row, heatmap)
            if (neighbors.every(n => p.height < n.height)) {
                lowestPoints.push(p)
            }
        })
    })

    return lowestPoints
}

function getBasin(point: Point, heatmap: number[][]): Basin {
    let basinSize: number = 0
    const visitedPoints: string[] = []
    const pointsToVisit: Point[] = [point]
    while (pointsToVisit.length > 0) {
        const currentPoint = pointsToVisit.shift() || point
        if (visitedPoints.includes(JSON.stringify(currentPoint))) {
            continue;
        }
        visitedPoints.push(JSON.stringify(currentPoint))
        basinSize = basinSize + 1
        const neighbors: Point[] = getNeighbors(currentPoint.x, currentPoint.y, heatmap)
        neighbors.forEach((n) => {
            if (n.height < 9 && !visitedPoints.includes(JSON.stringify(n))) {
                pointsToVisit.push(n)
            }
        })
    }

    return { x: point.x, y: point.y, height: point.height, basinSize: basinSize }
}

async function main() {
    const lowestPoints: Point[] = findLowPoints(heatmap)
    let basins: Basin[] = []
    lowestPoints.forEach((point: Point) => {
        const basin = getBasin(point, heatmap)
        basins.push(basin)
    })
    console.log(lowestPoints.reduce((memo, val) => memo + val.height + 1, 0))
    const basinSizes = basins.map(b => b.basinSize);
    const topThreeBasinSizes = basinSizes.sort((a, b) => b - a).slice(0, 3);
    console.log(topThreeBasinSizes.reduce((total, curr) => total * curr));
}

main()
