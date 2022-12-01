import * as fs from 'fs';

const f = fs.readFileSync('input.txt', 'utf-8');

let array: string[] = []

for (const line of f.split(/[\r\n]+/)) {
    array.push(line)
}

let horizontalPosition: number = 0
let depth: number = 0

array.forEach((value) => {
    const splitValue = value.split(/(\s+)/)
    const movement: string = splitValue[0]
    const addition: number = Number(splitValue[2])
    console.log(splitValue, movement, addition)

    switch (movement) {
        case 'forward': {
            horizontalPosition = horizontalPosition + addition
            break
        }
        case 'up': {
            depth = depth - addition
            break
        }
        case 'down': {
            depth = depth + addition
            break
        }
        default: {
            break
        }
    }
})

console.log(`Horizontal position: ${horizontalPosition}, depth: ${depth}. Multiplication = ${horizontalPosition * depth}`)