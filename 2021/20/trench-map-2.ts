import { readFileSync } from 'fs';

const input: string = readFileSync('input.txt', 'utf-8')

const testInput: string = `..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###`


type Pixel = '#' | '.'
type NumPixel = 1 | 0
type Image = Pixel[][]

class ImageEnhancer {
    image: Image
    width: number
    height: number
    algorithm: string

    constructor(input: string) {
        let processedInput = processInput(input)
        this.image = processedInput.image
        this.algorithm = processedInput.algorithm
        this.width = this.getWidth()
        this.height = this.getHeight()
    }

    public printImage = () => {
        let imageString: string = ''
        this.image.forEach(row => {
            imageString = imageString + row.join('') + '\n'
        })
        console.log(imageString)
    }

    public getWidth = () => this.image[0].length - 1 // Math.max.apply([...this.image.keys()].map(s => s.split('-')[0]))

    public getHeight = () => this.image.length - 1 // Math.max.apply([...this.image.keys()].map(s => s.split('-')[1]))

    public getNeighbors = (x: number, y: number) => {
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

        let pixels: string[] = []

        neighborCoordinates.forEach((coordinate: number[]) => {
            const nx: number = coordinate[0]
            const ny: number = coordinate[1]

            if (nx >= 0 && nx <= this.width && ny >= 0 && ny <= this.height) {
                pixels.push(this.image[ny][nx])
            }
        })

        return pixels
    }

    public expandImage = () => {
        for (let row of this.image) {
            row.unshift('.', '.')
            row.push('.', '.')
        }

        this.width = this.image[0].length - 1

        this.image.unshift(new Array<Pixel>(this.width + 1).fill('.'), new Array<Pixel>(this.width + 1).fill('.'))
        this.image.push(new Array<Pixel>(this.width + 1).fill('.'), new Array<Pixel>(this.width + 1).fill('.'))

        this.height = this.image.length - 1
    }

    public cropImage = () => {
        for (let row of this.image) {
            row.shift()
            row.pop()
        }
        this.image.shift()
        this.image.pop()

        this.width = this.getWidth()
        this.height = this.getHeight()
    }

    public calculateLitPixels = () => {
        const numPixels: number[] = this.image.flat().map(pixel => (pixel === '#') ? 1 as NumPixel : 0 as NumPixel)
        const litPixels = numPixels.reduce((a, b) => a + b, 0)
        return litPixels
    }

    public processPixels = () => {

        const newImage: Image = new Array<Pixel>(this.height + 1).fill('.').map(() =>
            new Array<Pixel>(this.width + 1).fill('.')
        )

        this.image.forEach((row, y) => {
            row.forEach((pixel, x) => {
                const neighboringPixels: string[] = this.getNeighbors(x, y)
                const neighboringNumPixels: NumPixel[] = neighboringPixels.map(pixel => (pixel === '#') ? 1 as NumPixel : 0 as NumPixel)
                const newBinary = neighboringNumPixels.join("")
                const newDecimal = parseInt(newBinary, 2)
                newImage[y][x] = this.algorithm.charAt(newDecimal) as Pixel
            })
        })

        this.image = newImage
    }

    public enhanceImage = (steps: number) => {

        for (let step = 1; step <= steps; step++) {
            this.expandImage()
            this.processPixels()
            this.cropImage()
            this.printImage()
            console.log(this.calculateLitPixels())
        }
    }

}


const processInput = (input: string): { algorithm: string, image: Image } => {
    let [algorithm, pixels] = input.split('\n\n')
    algorithm = algorithm.trim()

    const image: Image = pixels.split("\n").map(line => line.split("").map(pixel => pixel as Pixel))

    return { algorithm, image }
}


const imageEnhance = new ImageEnhancer(input)
imageEnhance.printImage()
console.log(imageEnhance.calculateLitPixels())
imageEnhance.enhanceImage(50)
