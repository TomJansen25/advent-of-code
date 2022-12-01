import { readFileSync } from 'fs';

const input: string[] = readFileSync('input.txt', 'utf-8').split("\n")

const testInput: string[] = `
[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`.split('\n')

const charPoints = new Map<string, number>([
    [')', 1], [']', 2], ['}', 3], ['>', 4]
])

const openCloseMap = new Map<string, string>([
    [')', '('], [']', '['], ['}', '{'], ['>', '<']
])

const closeOpenMap = new Map([...openCloseMap.entries()].map(
    ([key, value]) => ([value, key]))
);

const closingCharacters = [...openCloseMap.keys()];

console.log(closingCharacters)

function findIllegalClosing(input: string[]) {

    let scores: number[] = []

    for (let line of input) {

        // console.log(`processing new line...`)
        let lineOpeningCharacters: string[] = []

        const lineLength = line.length
        let isCorrupted: boolean = false

        for (let char of line) {

            if (closingCharacters.includes(char)) {
                // console.log(char)

                const lastOpeningCharacter: string = lineOpeningCharacters.pop() || ''
                const expectedOpenChar: string = openCloseMap.get(char) || ''

                if (expectedOpenChar !== lastOpeningCharacter) {
                    isCorrupted = true
                    break;
                }
            } else {
                lineOpeningCharacters.push(char)
                // console.log(lineOpeningCharacters)
            }
        }

        if (lineOpeningCharacters.length > 0 && isCorrupted == false) {

            let autocompleteScore: number = 0
            let completingCharacters: string[] = []

            while (lineOpeningCharacters.length > 0) {
                const lastOpeningCharacter: string = lineOpeningCharacters.pop() || ''
                const expectedClosingCharacter: string = closeOpenMap.get(lastOpeningCharacter) || ''
                completingCharacters.push(expectedClosingCharacter)
                autocompleteScore = autocompleteScore * 5 + (charPoints.get(expectedClosingCharacter) || 0)
                // score = score + 
            }

            scores.push(autocompleteScore)
        }
    }

    scores = scores.sort((n1, n2) => n1 - n2);
    console.log(scores)
    console.log(scores[Math.floor(scores.length / 2)])
}

async function main(input: string[]) {
    findIllegalClosing(input)
}

main(input)