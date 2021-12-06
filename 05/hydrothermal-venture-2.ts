import { readFileSync } from 'fs';

const f = readFileSync('input.txt', 'utf-8');

let input: string[] = []

for (const line of f.split(/[\r\n]+/)) {
    input.push(line)
}

let diagram = new Map<string, number>();

function fillHorizontalLine(x1: number, x2: number, y: number, diagram: Map<string, number>) {
    if (x1 > x2) {
        [x1, x2] = [x2, x1]
    }
    for (let i = x1; i <= x2; i++) {
        const coordinates = `${i},${y}`
        diagram.set(coordinates, (diagram.get(coordinates) || 0) + 1)
    }
}

function fillVerticalLine(y1: number, y2: number, x: number, diagram: Map<string, number>) {
    if (y1 > y2) {
        [y1, y2] = [y2, y1]
    }
    for (let i = y1; i <= y2; i++) {
        const coordinates = `${x},${i}`
        diagram.set(coordinates, (diagram.get(coordinates) || 0) + 1)
    }
}

function fillDiagonalLine(x1: number, y1: number, x2: number, y2: number, diagram: Map<string, number>) {
    if (x1 > x2) {
        [x1, x2, y1, y2] = [x2, x1, y2, y1]
    }
    const direction = y1 < y2 ? 1 : -1
    for (let i = 0; i <= x2 - x1; i++) {
        const coordinates = `${x1 + i},${y1 + i * direction}`;
        diagram.set(coordinates, (diagram.get(coordinates) || 0) + 1)
    }
}


input.forEach((line: string) => {
    const [coordinate1, coordinate2] = line.split(' -> ').map(x => x.trim());
    const [x1, y1] = coordinate1.split(',').map(Number)
    const [x2, y2] = coordinate2.split(',').map(Number)

    if (y1 === y2) {
        fillHorizontalLine(x1, x2, y1, diagram)
    } else if (x1 === x2) {
        fillVerticalLine(y1, y2, x1, diagram)
    } else {
        fillDiagonalLine(x1, y1, x2, y2, diagram)
    }
})

const answer = [...diagram.values()].filter(value => value > 1).length
console.log(answer)