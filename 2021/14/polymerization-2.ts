import { readFileSync } from 'fs';

const input: string = readFileSync('input.txt', 'utf-8')

const testInput: string = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`


function parseInput(f: string) {
    const [rawPolymer, rawInsertionRules] = f.split("\n\n")

    const polymer = new Map<string, number>()

    for (let i = 0; i < rawPolymer.length - 1; ++i) {

        const currChar = rawPolymer.charAt(i)
        const nextChar = rawPolymer.charAt(i + 1)

        polymer.set(`${currChar}${nextChar}`, (polymer.get(`${currChar}${nextChar}`) || 0) + 1)
    }

    const insertionRules = new Map<string, string>()
    rawInsertionRules.split('\n').map((rule) => {
        const [chars, newChar] = rule.split(' -> ');
        insertionRules.set(chars, newChar);
    })

    return { polymer, insertionRules }
}

function processPolymer(polymer: Map<string, number>, insertionRules: Map<string, string>, steps: number) {

    for (let step = 1; step <= steps; step++) {

        console.log(`----------- Step ${step} -------------`)

        let newPolymer = new Map<string, number>()

        for (let [charCombi, occurrences] of polymer) {

            const currChar = charCombi.charAt(0)
            const nextChar = charCombi.charAt(1)

            let newChar: string = insertionRules.get(charCombi) || ''

            const charPrefix: string = `${newChar}${nextChar}`
            const charSuffix: string = `${currChar}${newChar}`

            newPolymer.set(charPrefix, (newPolymer.get(charPrefix) || 0) + occurrences)
            newPolymer.set(charSuffix, (newPolymer.get(charSuffix) || 0) + occurrences)

        }

        polymer = newPolymer

    }

    return polymer

}


function calculateScore(polymer: Map<string, number>) {

    const occurences = new Map<string, number>()

    for (let [charCombi, count] of polymer) {

        const firstChar = charCombi.charAt(0)
        const secondChar = charCombi.charAt(1)

        occurences.set(firstChar, (occurences.get(firstChar) || 0) + count)
        occurences.set(secondChar, (occurences.get(secondChar) || 0) + count)
    }

    for (const [char, count] of occurences) {
        occurences.set(char, Math.ceil(count / 2));
    }

    const maxOccurr: number = Math.max.apply(Math, [...occurences.values()])
    const minOccurr: number = Math.min.apply(Math, [...occurences.values()])

    console.log(maxOccurr - minOccurr)

}


async function main(input: string) {
    let { polymer, insertionRules } = parseInput(input)
    polymer = processPolymer(polymer, insertionRules, 40)
    calculateScore(polymer)
}

main(input)