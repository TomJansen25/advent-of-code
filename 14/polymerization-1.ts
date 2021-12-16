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
    const [polymer, rawInsertionRules] = f.split("\n\n")

    const insertionRules = new Map<string, string>()
    rawInsertionRules.split('\n').map((rule) => {
        let r: string[] = rule.split(' -> ')
        insertionRules.set(r[0], r[1])
    })

    return { polymer, insertionRules }
}

function processPolymer(polymer: string, insertionRules: Map<string, string>, steps: number) {

    for (let step = 1; step <= steps; step++) {

        let newString: string = ''

        for (let i = 0; i < polymer.length - 1; ++i) {

            const currChar = polymer.charAt(i)
            const nextChar = polymer.charAt(i + 1)

            newString = newString + currChar
            newString = newString + insertionRules.get(`${currChar}${nextChar}`)

        }

        newString = newString + polymer.charAt(polymer.length - 1)

        console.log(`After step ${step}: length = ${newString.length}`)
        polymer = newString

    }

    return polymer

}


function calculateScore(polymer: string) {

    const occurences: Map<string, number> = Array.from(polymer).reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());

    const maxOccurr: number = Math.max.apply(Math, [...occurences.values()])
    const minOccurr: number = Math.min.apply(Math, [...occurences.values()])

    console.log(maxOccurr - minOccurr)

}


async function main(input: string) {
    let { polymer, insertionRules } = parseInput(input)
    console.log(polymer)
    // console.log(insertionRules)
    polymer = processPolymer(polymer, insertionRules, 40)
    calculateScore(polymer)
}

main(testInput)