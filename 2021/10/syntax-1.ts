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
    [')', 3], [']', 57], ['}', 1197], ['>', 25137]
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

    let score: number = 0

    for (let line of input) {

        console.log(`processing new line...`)
        let lineOpeningCharacters: string[] = []

        for (let char of line) {
            if (closingCharacters.includes(char)) {
                console.log(char)

                const lastOpeningCharacter: string = lineOpeningCharacters.pop() || ''
                const expectedOpenChar: string = openCloseMap.get(char) || ''

                if (expectedOpenChar !== lastOpeningCharacter) {
                    console.log(`Expected ${closeOpenMap.get(lastOpeningCharacter)} but found ${char}`)
                    score = score + (charPoints.get(char) || 0)
                    break;
                }
            } else {
                lineOpeningCharacters.push(char)
                console.log(lineOpeningCharacters)
            }
        }

        console.log(score)
    }
}

async function main(input: string[]) {
    findIllegalClosing(input)
}

main(testInput)