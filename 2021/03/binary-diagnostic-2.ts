import { readFileSync } from 'fs';

const f = readFileSync('input.txt', 'utf-8');

let array: string[] = []

for (const line of f.split(/[\r\n]+/)) {
    array.push(line)
}

// let array: string[] = ["00100", "11110", "10110", "10111", "10101", "01111", "00111", "11100", "10000", "11001", "00010", "01010"]

let gammaRate: string = ''
let epsilonRate: string = ''

function retrieveMostCommon(position: number): [number, number] {
    let bits: number[] = []

    array.forEach((value) => {
        bits.push(Number(value[position]))
    })

    let zeroCounts: number = 0;
    let oneCounts: number = 0;

    bits.forEach((value) => {
        if (value === 0) {
            zeroCounts = zeroCounts + 1
        } else {
            oneCounts = oneCounts + 1
        }

    })

    return [zeroCounts, oneCounts]
}

let i: number = 0;

while (array.length > 1) {
    const [zc, oc] = retrieveMostCommon(i)
    const mc: number = (zc > oc) ? 0 : 1
    array = array.filter(function (str) { return str[i] === String(mc); });
    i++;
}

gammaRate = array[0]

array = []

for (const line of f.split(/[\r\n]+/)) {
    array.push(line)
}

i = 0

while (array.length > 1) {
    const [zc, oc] = retrieveMostCommon(i)
    const lc: number = (zc > oc) ? 1 : 0
    array = array.filter(function (str) { return str[i] === String(lc); });
    i++
}

epsilonRate = array[0]

const gammaRateDecimal = parseInt(gammaRate, 2)
const epsilonRateDecimal = parseInt(epsilonRate, 2)

console.log(`Gamma rate = ${gammaRate}, epsilon rate = ${epsilonRate}`)
console.log(`Gamma rate decimal = ${gammaRateDecimal}, epsilon rate decimal = ${epsilonRateDecimal}. Multiplication = ${gammaRateDecimal * epsilonRateDecimal}`)