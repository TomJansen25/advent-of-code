import { readFileSync } from 'fs';

const input: string = readFileSync('input.txt', 'utf-8')

const testInput: string = `..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

...............
...............
...............
...............
...............
.....#..#......
.....#.........
.....##..#.....
.......#.......
.......###.....
...............
...............
...............
...............
...............`


type BinaryMap = Map<string, string>
type PixelMap = Map<string, number>
type DecimalMap = PixelMap
type Image = number[][]

function getNeighbors(x: number, y: number, image: Image, xMax: number, yMax: number): number[] {

    let neighborCoordinates: number[][] = [
        [x - 1, y - 1],
        [x, y - 1],
        [x + 1, y - 1],
        [x - 1, y],
        [x, y],
        [x + 1, y],
        [x - 1, y + 1],
        [x, y + 1],
        [x + 1, y + 1],
    ]

    let binary: number[] = []

    neighborCoordinates.forEach((coordinate: number[]) => {
        const nx: number = coordinate[0]
        const ny: number = coordinate[1]

        if (nx >= 0 && nx <= xMax && ny >= 0 && ny <= yMax) {
            binary.push(image[ny][nx])
        }
    })

    return binary
}


const printImage = (image: string[][]) => {
    let imageString: string = ''
    image.forEach(row => {
        imageString = imageString + row.join('') + '\n'
    })
    console.log(imageString)
}


const expandImage = (image: Image, steps: number): { image: Image, xMax: number, yMax: number } => {

    for (let step = 1; step <= steps; step++) {
        for (let row of image) {
            row.unshift(0, 0)
            row.push(0, 0)
        }
    }

    const xMax: number = image[0].length - 1

    for (let step = 1; step <= steps; step++) {
        image.unshift(new Array<number>(xMax + 1).fill(0), new Array<number>(xMax + 1).fill(0))
        image.push(new Array<number>(xMax + 1).fill(0), new Array<number>(xMax + 1).fill(0))
    }

    const yMax: number = image.length - 1

    return { image, xMax, yMax }

}


const processInput = (input: string, steps: number): { algorithm: string, image: Image, xMax: number, yMax: number } => {
    let [algorithm, pixels] = input.split('\n\n')
    algorithm = algorithm.trim()

    const initialImage: Image = pixels.split("\n").map(line => line.split("").map(pixel => (pixel === '#') ? 1 : 0))
    const { image, xMax, yMax } = expandImage(initialImage, steps)

    printImage(image.map(line => line.map(pixel => (pixel === 1) ? '#' : '.')))

    console.log(xMax, yMax)

    return { algorithm, image, xMax, yMax }
}

const processPixels = (image: Image, xMax: number, yMax: number): BinaryMap => {

    const newPixels: number[][] = []
    const newBinaries: string[] = []
    const newBinaryMap: BinaryMap = new Map()

    image.forEach((row, y) => {
        row.forEach((pixel, x) => {
            const newPixel: number[] = getNeighbors(x, y, image, xMax, yMax)
            newPixels.push(newPixel)
            const newBinary = newPixel.join("")
            newBinaries.push(newBinary)
            newBinaryMap.set(`${x}-${y}`, newBinary)
        })
    })

    // console.log(newPixels)
    // console.log(newBinaries)
    return newBinaryMap
}

const binaryToDecimalMap = (binaryMap: BinaryMap): DecimalMap => {
    const newDecimalMap: DecimalMap = new Map()
    for (let [key, binary] of binaryMap) {
        newDecimalMap.set(key, parseInt(binary, 2))
    }
    return newDecimalMap
}

const decimalMapToImage = (decimalMap: DecimalMap, algorithm: string, xMax: number, yMax: number): Image => {
    const newImage: string[][] = new Array<string>(yMax + 1).fill('.').map(() =>
        new Array<string>(xMax + 1).fill('.')
    )
    for (let [key, binary] of decimalMap) {
        const coordinates: number[] = key.split('-').map(Number)

        newImage[coordinates[1]][coordinates[0]] = algorithm.charAt(binary)
    }

    printImage(newImage)

    const image: number[][] = newImage.map(line => line.map(pixel => (pixel === '#') ? 1 : 0))

    return image
}

const calculateLitPixels = (image: Image) => image.flat().reduce((a, b) => a + b, 0)


async function main(input: string, steps: number) {
    let { algorithm, image, xMax, yMax } = processInput(input, steps)

    for (let step = 1; step <= steps; step++) {
        const newImage: BinaryMap = processPixels(image, xMax, yMax)
        const newDecimals: DecimalMap = binaryToDecimalMap(newImage)
        image = decimalMapToImage(newDecimals, algorithm, xMax, yMax)
    }

    console.log(calculateLitPixels(image) - 4)
}

main(input, 2)