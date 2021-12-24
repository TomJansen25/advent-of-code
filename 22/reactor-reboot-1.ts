import { readFileSync } from 'fs';

const input: string = readFileSync('input.txt', 'utf-8')

const testInput1: string = `on x=10..12,y=10..12,z=10..12
on x=11..13,y=11..13,z=11..13
off x=9..11,y=9..11,z=9..11
on x=10..10,y=10..10,z=10..10`

const testInput2: string = `on x=-20..26,y=-36..17,z=-47..7
on x=-20..33,y=-21..23,z=-26..28
on x=-22..28,y=-29..23,z=-38..16
on x=-46..7,y=-6..46,z=-50..-1
on x=-49..1,y=-3..46,z=-24..28
on x=2..47,y=-22..22,z=-23..27
on x=-27..23,y=-28..26,z=-21..29
on x=-39..5,y=-6..47,z=-3..44
on x=-30..21,y=-8..43,z=-13..34
on x=-22..26,y=-27..20,z=-29..19
off x=-48..-32,y=26..41,z=-47..-37
on x=-12..35,y=6..50,z=-50..-2
off x=-48..-32,y=-32..-16,z=-15..-5
on x=-18..26,y=-33..15,z=-7..46
off x=-40..-22,y=-38..-28,z=23..41
on x=-16..35,y=-41..10,z=-47..6
off x=-32..-23,y=11..30,z=-14..3
on x=-49..-5,y=-3..45,z=-29..18
off x=18..30,y=-20..-8,z=-3..13
on x=-41..9,y=-7..43,z=-33..15
on x=-54112..-39298,y=-85059..-49293,z=-27449..7877
on x=967..23432,y=45373..81175,z=27513..53682`

type Command = {
    set: string,
    x: [xMin: number, xMax: number],
    y: [yMin: number, yMax: number],
    z: [zMin: number, zMax: number],
}

type Cuboid = [x: number, y: number, z: number]

type Reactor = Map<string, number>

function processInput(input: string): Command[] {

    let commands: Command[] = []

    const lines: string[] = input.split('\n')

    lines.forEach((line) => {

        let currentCommand = {} as Command

        const cmds: string[] = line.split(' ')
        currentCommand.set = cmds[0]

        cmds[1].split(',').forEach((c) => {
            const [p, m] = c.split('=')
            const [minM, maxM] = m.split('..')

            switch (p) {
                case 'x': currentCommand.x = [Number(minM), Number(maxM)];
                case 'y': currentCommand.y = [Number(minM), Number(maxM)];
                case 'z': currentCommand.z = [Number(minM), Number(maxM)];
            }
        })

        if (currentCommand.x[0] >= -50 && currentCommand.x[1] <= 50 &&
            currentCommand.y[0] >= -50 && currentCommand.y[1] <= 50 &&
            currentCommand.z[0] >= -50 && currentCommand.z[1] <= 50) {
            commands.push(currentCommand)
        }
    })

    return commands

}

function commandToCuboid(command: Command, reactor: Reactor): Reactor {

    for (let x: number = command.x[0]; x <= command.x[1]; x++) {
        for (let y: number = command.y[0]; y <= command.y[1]; y++) {
            for (let z: number = command.z[0]; z <= command.z[1]; z++) {
                const cuboid: Cuboid = [x, y, z]
                const reactorKey = JSON.stringify(cuboid)
                if (command.set === 'off') reactor.delete(reactorKey)
                else reactor.set(reactorKey, 1)
            }
        }
    }

    return reactor
}

function main(input: string): Map<string, number> {

    const commands = processInput(input)

    let reactor: Reactor = new Map();

    for (let command of commands) {
        console.log(command)
        reactor = commandToCuboid(command, reactor)
    }

    return reactor
}

const reactor = main(input)
const sum = [...reactor.values()].reduce((acc, cur) => acc + cur, 0)
console.log(sum)
