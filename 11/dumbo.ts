import { readFileSync } from 'fs';

const input: number[][] = readFileSync('input.txt', 'utf-8').split("\n").map(line => line.split("").map(Number))

const testInput: number[][] = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`.split("\n").map(line => line.split("").map(Number))

type Point = {
    x: number,
    y: number,
    brightness: number
}

const maxRow: number = testInput.length - 1
const maxCol: number = testInput[0].length - 1


function increaseNeighbors(x: number, y: number, heatmap: number[][], hasFlashed: string[]) {

    let neighborCoordinates: number[][] = [
        [x - 1, y],
        [x - 1, y + 1],
        [x - 1, y - 1],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
        [x + 1, y + 1],
        [x + 1, y - 1],
    ]

    neighborCoordinates.forEach((coordinate: number[]) => {
        const x: number = coordinate[0]
        const y: number = coordinate[1]
        if (x >= 0 && x <= maxCol && y >= 0 && y <= maxRow && !hasFlashed.includes(`${x}-${y}`)) {
            heatmap[y][x] = heatmap[y][x] + 1
        }
    })

    return heatmap
}

function simulateSteps(heatmap: number[][], steps: number) {

    let flashes: number = 0
    let foundAllFlashing: boolean = false

    for (let step = 1; step <= steps; step++) {
        // while (foundAllFlashing === false) {

        let stepFlashes: number = 0
        let flashesToProcess: string[] = []
        let hasFlashed: string[] = []

        heatmap.forEach((row, rowIndex) => {
            row.forEach((brightness, colIndex) => {
                const newBrightness: number = brightness + 1
                heatmap[rowIndex][colIndex] = newBrightness
                if (newBrightness > 9) {
                    heatmap[rowIndex][colIndex] = 0
                    stepFlashes++
                    flashes++
                    flashesToProcess.push(`${colIndex}-${rowIndex}`)
                    hasFlashed.push(`${colIndex}-${rowIndex}`)
                }
            })
        })

        if (flashesToProcess.length > 0) {

            for (let flash of flashesToProcess) {
                const coordinates: number[] = flash.split('-').map(Number)
                const x: number = coordinates[0]
                const y: number = coordinates[1]
                increaseNeighbors(x, y, heatmap, hasFlashed)

                heatmap.forEach((row, rowIndex) => {
                    row.forEach((brightness, colIndex) => {
                        if (brightness > 9) {
                            heatmap[rowIndex][colIndex] = 0
                            const index = flashesToProcess.indexOf(`${colIndex}-${rowIndex}`, 0)
                            if (index > -1) { flashesToProcess.splice(index, 1) }
                            flashes++
                            stepFlashes++
                            flashesToProcess.push(`${colIndex}-${rowIndex}`)
                            hasFlashed.push(`${colIndex}-${rowIndex}`)
                        }
                    })
                })
            }
        }

        if (stepFlashes === ((maxRow + 1) * (maxCol + 1))) {
            console.log(`All octopuses flashed at step ${step}`)
            foundAllFlashing = true
            break;
        }
    }
    console.log(flashes)
}

async function main(input: number[][]) {
    simulateSteps(input, 500)
}

main(input)