import { readFileSync } from 'fs';

const f = readFileSync('input.txt', 'utf-8');
// const f = '3,4,3,1,2'
let input: number[] = f.split(',').map(Number)

const days: number = 80

function slow(input: number[], days: number) {

    let lanternfish: number[] = input

    for (let day = 1; day <= days; day++) {

        lanternfish.forEach((fish: number, index: number) => {
            if (fish == 0) {
                lanternfish.push(8)
                lanternfish[index] = 6
            }
            else {
                lanternfish[index] = fish - 1
            }
        })
        // console.log(`After ${day} days: ${lanternfish}`)
    }

    console.log(lanternfish.length)
}

function fast(input: number[], days: number) {

    let lanternfish: number[] = []

    for (const fish of input) {
        lanternfish[fish] = (lanternfish[fish] ?? 0) + 1;
    }

    for (let day = 1; day <= days; day++) {

        const newFish: number = lanternfish.shift() ?? 0
        // console.log(`New fish: ${newFish}`)

        lanternfish[6] = (lanternfish[6] ?? 0) + newFish
        lanternfish[8] = newFish

        // console.log(`After ${day} days: ${lanternfish}`)
    }

    let totalFish: number = 0
    lanternfish.map(v => totalFish = totalFish + v)
    console.log(totalFish)
}

console.log(input)

// slow(input, 18)
fast(input, 256)