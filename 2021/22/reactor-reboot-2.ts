import { readFileSync } from 'fs';

const input: string = readFileSync('input.txt', 'utf-8')
const testInput1: string = readFileSync('testInput1.txt', 'utf-8')
const testInput2: string = readFileSync('testInput2.txt', 'utf-8')

type Range = [from: number, to: number];
type CuboidRange = { x: Range, y: Range, z: Range }

type Command = {
    set: string,
    cuboidRange: CuboidRange
}

function processInput(input: string): Command[] {

    let commands: Command[] = []
    const lines: string[] = input.split('\n')

    lines.forEach((line) => {

        let currentCommand = {} as Command

        const cmds: string[] = line.split(' ')
        currentCommand.set = cmds[0]
        currentCommand.cuboidRange = {} as CuboidRange

        cmds[1].split(',').forEach((c) => {
            const [p, m] = c.split('=')
            const [minM, maxM] = m.split('..')

            switch (p) {
                case 'x': currentCommand.cuboidRange.x = [Number(minM), Number(maxM)];
                case 'y': currentCommand.cuboidRange.y = [Number(minM), Number(maxM)];
                case 'z': currentCommand.cuboidRange.z = [Number(minM), Number(maxM)];
            }
        })
        commands.push(currentCommand)
    })

    return commands

}

const calculateCuboidVolume = (cuboidRange: CuboidRange): number => (
    (cuboidRange.x[1] - cuboidRange.x[0] + 1) * (cuboidRange.y[1] - cuboidRange.y[0] + 1) * (
        cuboidRange.z[1] - cuboidRange.z[0] + 1)
)

const checkRangeOverlap = (range1: Range, range2: Range): boolean => (
    range1[1] > range2[0] && range2[1] > range1[0])

const checkCuboidRangeOverlap = (cuboidRange1: CuboidRange, cuboidRange2: CuboidRange): boolean => (
    checkRangeOverlap(cuboidRange1.x, cuboidRange2.x) && checkRangeOverlap(
        cuboidRange1.y, cuboidRange2.y) && checkRangeOverlap(cuboidRange1.z, cuboidRange2.z)
)

const calculateRangeOverlap = (range1: Range, range2: Range): Range => (
    [Math.max(range1[0], range2[0]), Math.min(range1[1], range2[1])] as Range)

const calculateCuboidRangeOverlap = (cuboidRange1: CuboidRange, cuboidRange2: CuboidRange): CuboidRange => {

    let overlapCuboidRange = {} as CuboidRange

    overlapCuboidRange.x = calculateRangeOverlap(cuboidRange1.x, cuboidRange2.x)
    overlapCuboidRange.y = calculateRangeOverlap(cuboidRange1.y, cuboidRange2.y)
    overlapCuboidRange.z = calculateRangeOverlap(cuboidRange1.z, cuboidRange2.z)

    return overlapCuboidRange
}

const main = (input: string): number => {

    const commands = processInput(input)

    let onCuboids: CuboidRange[] = []
    let allOverlaps: CuboidRange[] = []

    for (let command of commands) {
        console.log(command)
        const cuboidRange: CuboidRange = command.cuboidRange

        let overlaps: CuboidRange[] = []
        let parts: CuboidRange[] = []

        for (let cuboid of onCuboids) {
            if (checkCuboidRangeOverlap(cuboid, cuboidRange)) {
                overlaps.push(calculateCuboidRangeOverlap(cuboid, cuboidRange))
            }
        }

        for (let cuboid of allOverlaps) {
            if (checkCuboidRangeOverlap(cuboid, cuboidRange)) {
                parts.push(calculateCuboidRangeOverlap(cuboid, cuboidRange))
            }
        }

        onCuboids.push(...parts);
        allOverlaps.push(...overlaps);

        if (command.set === 'on') {
            onCuboids.push(cuboidRange)
        }

    }

    let totalVolume: number = 0;
    for (let cuboid of onCuboids) {
        totalVolume = totalVolume + calculateCuboidVolume(cuboid)
    }
    for (let cuboid of allOverlaps) {
        totalVolume = totalVolume - calculateCuboidVolume(cuboid)
    }

    return totalVolume
}


const sum = main(input)
console.log(sum)
