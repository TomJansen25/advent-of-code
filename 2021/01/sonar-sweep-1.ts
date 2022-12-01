import * as fs from 'fs';

const f = fs.readFileSync('input.txt', 'utf-8');

let array: Number[] = []

for (const line of f.split(/[\r\n]+/)) {
    const number = Number(line)
    array.push(number);
}

let higherCounter: number = 0

array.forEach((value, index) => {
    const prevIndex = index - 1
    if (value > array[prevIndex]) {
        higherCounter = higherCounter + 1
    }
});

console.log(higherCounter)