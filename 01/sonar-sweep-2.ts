import * as fs from 'fs';

const f = fs.readFileSync('input.txt', 'utf-8');

let array: number[] = []

for (const line of f.split(/[\r\n]+/)) {
    const number = Number(line)
    array.push(number);
}

let summedArray: number[] = []

array.forEach((value: number, index: number) => {
    const newValue = value + array[index + 1] + array[index + 2]
    summedArray.push(newValue)
});

let higherCounter: number = 0

summedArray.forEach((value: number, index: number) => {
    const prevIndex = index - 1
    if (value > summedArray[prevIndex]) {
        higherCounter = higherCounter + 1
    }
});

console.log(higherCounter)