import { assert } from 'console';
import { readFileSync } from 'fs';

const input: string = readFileSync('input.txt', 'utf-8')

const testInput0: string = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`

const testInput1: string = `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`

const testInput2: string = `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`

type Path = string[]
type Connections = Map<string, string[]>

class Graph {
    start: string
    end: string
    connections: Connections
    paths: Path[] = []

    constructor(input: string, start: string = 'start', end: string = 'end') {
        this.start = start
        this.end = end
        this.connections = this.getConnections(input)
        this.findPaths(this.start)
    }

    public getConnections = (input: string): Connections => {
        const connections: Connections = new Map()
        input.split("\n").map(line => {
            const [conn1, conn2] = line.split("-")
            let currConnections: Path = connections.get(conn1) || []
            currConnections.push(conn2)
            connections.set(conn1, currConnections)

            currConnections = connections.get(conn2) || []
            currConnections.push(conn1)
            connections.set(conn2, currConnections)
        })
        return connections
    }

    private isBigCave = (cave: string) => cave === cave.toUpperCase()

    private isSmallCave = (cave: string) => cave === cave.toLowerCase()

    public getNumPaths = () => this.paths.length

    public findPaths = (currentNode: string, path: Path = []) => {

        const newPath: Path = Object.assign([], path)
        newPath.push(currentNode)

        if (currentNode === this.end) {
            const currentPaths: Path = this.paths.map(p => p.join(''))
            if (!currentPaths.includes(newPath.join(''))) {
                this.paths.push(newPath)
            }
        } else {
            for (let neighbor of this.connections.get(currentNode) || []) {
                // if (!newPath.includes(neighbor) || this.isBigCave(neighbor)) {
                if (this.isBigCave(neighbor) || this.canTraverse(newPath, neighbor) && neighbor !== this.start) {
                    this.findPaths(neighbor, newPath)
                }
            }
        }
    }

    public canTraverse = (path: Path, nextNode: string): boolean => {
        let tempPath: Path = Object.assign([], path)
        tempPath = tempPath.filter(p => p !== this.start && p !== this.end)

        const smallCavesCounter = new Map<string, number>()
        for (let node of tempPath) {
            if (this.isSmallCave(node)) {
                const nodeCount: number = (smallCavesCounter.get(node) || 0) + 1
                smallCavesCounter.set(node, nodeCount)
            }
        }
        const doubles: number[] = [...smallCavesCounter.values()].filter(p => p === 2)

        const nextNodeCount: number = smallCavesCounter.get(nextNode) || 0
        if (nextNodeCount < 2 && doubles.length < 2) {
            return true
        } else {
            return false
        }
    }
}


async function main(input: string) {
    const graph: Graph = new Graph(input)
    console.log(graph.getNumPaths())
}

main(input)