import { readFileSync } from 'fs';

const input: string = readFileSync('input.txt', 'utf-8')

const testInput: string = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`

/* Code following
2 letters = 1
3 letters = 7
4 letters = 4
5 letters = 2, 3, 5
6 letters = 0, 6, 9
7 letters = 8

Side as follows:
    s0
s1      s2
    s3
s4      s5
    s6

*/

type Pattern = string[]
type PatternMap = Map<Pattern, number>
type DecodeMap = Map<string, number>

class SegmentDecoder {
    patterns: Pattern[]
    output: Pattern[]
    decodedPattern: DecodeMap = new Map() as DecodeMap
    outputValue: number = 0

    constructor(patterns: Pattern[], output: Pattern[]) {
        this.patterns = patterns
        this.output = output
    }

    public decodePattern = () => {

        const one: Pattern = this.patterns.find(p => p.length === 2) || []
        const seven: Pattern = this.patterns.find(p => p.length === 3) || []
        const four: Pattern = this.patterns.find(p => p.length === 4) || []

        const eight: Pattern = this.patterns.find(p => p.length === 7) || []
        const twoThreeFive: Pattern[] = this.patterns.filter(p => p.length === 5) || []
        const zeroSixNine: Pattern[] = this.patterns.filter(p => p.length === 6) || []

        const nineIndex: number = zeroSixNine.map(digit => this.getOverlap(digit, four)).indexOf(4)
        const nine: Pattern = zeroSixNine[nineIndex]
        zeroSixNine.splice(nineIndex, 1)

        const zeroIndex: number = zeroSixNine.map(digit => this.getOverlap(digit, one)).indexOf(2)
        const zero: Pattern = zeroSixNine[zeroIndex]
        zeroSixNine.splice(zeroIndex, 1)
        const six: Pattern = zeroSixNine[0]

        const threeIndex: number = twoThreeFive.map(digit => this.getOverlap(digit, one)).indexOf(2)
        const three: Pattern = twoThreeFive[threeIndex]
        twoThreeFive.splice(threeIndex, 1)

        const twoIndex: number = twoThreeFive.map(digit => this.getOverlap(digit, six)).indexOf(4)
        const two: Pattern = twoThreeFive[twoIndex]
        twoThreeFive.splice(twoIndex, 1)
        const five: Pattern = twoThreeFive[0]

        const initialDecodeMap: PatternMap = new Map([
            [zero, 0], [one, 1], [two, 2], [three, 3], [four, 4], [five, 5], [six, 6], [seven, 7], [eight, 8], [nine, 9]
        ])
        const decodeMap: DecodeMap = new Map()
        for (let [key, value] of initialDecodeMap) {
            key.sort()
            const newKey: string = key.join('')
            decodeMap.set(newKey, value)
        }

        this.decodedPattern = decodeMap
    }

    public getOverlap = (pattern1: Pattern, pattern2: Pattern) => (pattern1.filter(x => pattern2.includes(x)).length)

    public getSimpleOutputValue = () => {
        for (let output of this.output) {
            output.sort()
            const outputString: string = output.join('')
            const outputValue = this.decodedPattern.get(outputString) || 0
            if ([1, 4, 7, 8].includes(outputValue)) {
                this.outputValue += 1
            }
        }
    }

    public getComplexOutputValue = () => {
        let stringOutput: string = ''
        for (let output of this.output) {
            output.sort()
            const outputString: string = output.join('')
            const outputValue: number = this.decodedPattern.get(outputString) || 0
            stringOutput += outputValue.toString()
        }
        this.outputValue = Number(stringOutput)
    }

}

type PatternOutputMap = Map<Pattern[], Pattern[]>

const processInput = (input: string) => {
    const lines = input.split('\n')

    const patternOutputMap: PatternOutputMap = new Map() as PatternOutputMap

    lines.forEach(line => {
        let [pattern, output] = line.split(' | ')
        const patterns: string[][] = pattern.split(' ').map(p => p.trim().split(''))
        const outputs: string[][] = output.split(' ').map(p => p.trim().split(''))
        patternOutputMap.set(patterns, outputs)
    })

    return patternOutputMap
}


async function main(input: string) {
    const patternOutputMap: PatternOutputMap = processInput(input)
    let simpleDigitCount: number = 0

    for (let [key, value] of patternOutputMap) {
        const segmentDecoder: SegmentDecoder = new SegmentDecoder(key, value)
        segmentDecoder.decodePattern()
        segmentDecoder.getSimpleOutputValue()
        simpleDigitCount += segmentDecoder.outputValue
    }

    console.log(`Part 1 answer: ${simpleDigitCount}`)

    let complexDigitCount: number = 0
    for (let [key, value] of patternOutputMap) {
        const segmentDecoder: SegmentDecoder = new SegmentDecoder(key, value)
        segmentDecoder.decodePattern()
        segmentDecoder.getComplexOutputValue()
        complexDigitCount += segmentDecoder.outputValue
    }

    console.log(`Part 2 answer: ${complexDigitCount}`)
}

main(input)