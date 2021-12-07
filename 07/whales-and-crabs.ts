import { readFileSync } from 'fs';

const input = readFileSync('input.txt', 'utf-8');
const array: number[] = input.split(',').map(Number)

const minValue: number = Math.min.apply(Math, array)
const maxValue: number = Math.max.apply(Math, array)

let fuelCosts = new Map<number, number>()

function range(start: number, end: number) { return [...Array(1 + end - start).keys()].map(v => start + v) }

for (let i = minValue; i <= maxValue; i++) {

    let positionFuelCosts: number = 0

    array.forEach((crab) => {
        const simpleFuelCost: number = Math.abs(crab - i)
        const fuelRange: number[] = range(1, simpleFuelCost)
        const complicatedFuelCost: number = fuelRange.reduce((acc, cur) => acc + cur, 0);
        positionFuelCosts = positionFuelCosts + complicatedFuelCost
    })
    fuelCosts.set(i, positionFuelCosts)
}

const minimalFuel = Math.min.apply(Math, ([...fuelCosts.values()]))
console.log(`Minimal fuel = ${minimalFuel}`)

for (let [key, value] of fuelCosts.entries()) {
    if (value === minimalFuel) {
        console.log(`Optimal position = ${key}`)
    }
}
