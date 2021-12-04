import * as fs from 'fs';

const f = fs.readFileSync('input.txt', 'utf-8');

let array: string[] = []

for (const line of f.split(/[\r\n]+/)) {
    array.push(line)
}

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

    const mostCommon: number = (zeroCounts > oneCounts) ? 0 : 1
    const leastCommon: number = (mostCommon === 0) ? 1 : 0

    return [mostCommon, leastCommon]
}

const len = Array.from(Array(array[0].length).keys())

len.forEach((value) => {
    const [mc, lc] = retrieveMostCommon(value)
    gammaRate = gammaRate + String(mc)
    epsilonRate = epsilonRate + String(lc)
})

const gammaRateDecimal = parseInt(gammaRate, 2)
const epsilonRateDecimal = parseInt(epsilonRate, 2)

console.log(`Gamma rate decimal = ${gammaRateDecimal}, epsilon rate decimal = ${epsilonRateDecimal}. Multiplication = ${gammaRateDecimal * epsilonRateDecimal}`)