import * as fs from 'fs';

const f = fs.readFileSync('input.txt', 'utf-8');

// const array = ['forward 5', 'down 5', 'forward 8', 'up 3', 'down 8', 'forward 2']
let array: string[] = []

for (const line of f.split(/[\r\n]+/)) {
    array.push(line)
}

let horizontalPosition: number = 0
let aim: number = 0
let depth: number = 0
let depthIncrease: number = 0

array.forEach((value) => {
    const splitValue: string[] = value.split(/(\s+)/)
    const movement: string = splitValue[0]
    const addition: number = Number(splitValue[2])

    switch (movement) {
        case 'forward': {
            depthIncrease = addition * aim
            horizontalPosition = horizontalPosition + addition
            depth = depth + depthIncrease
            break
        }
        case 'up': {
            aim = aim - addition
            break
        }
        case 'down': {
            aim = aim + addition
            break
        }
        default: {
            break
        }
    }
})

console.log(`Horizontal position: ${horizontalPosition}, aim: ${aim}, depth: ${depth}. Multiplication = ${horizontalPosition * depth}`)