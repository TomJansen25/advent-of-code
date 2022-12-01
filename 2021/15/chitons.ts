import { readFileSync } from 'fs'

const input: string = readFileSync('input.txt', 'utf-8')

const testInput: string = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`

type Distance = Map<string, number>
type Graph = Map<string, Distance>
type Nodes = number[][]

class GraphTraverser {
    nodes: Nodes = []
    graph: Graph
    start: string = '0-0'
    end: string = ''
    visited: string[] = []
    distances: Map<string, number> = new Map()

    constructor(input: string, expand: boolean = false, startNode: string | null = null, endNode: string | null = null) {
        this.graph = this.stringToGraph(input, expand)
        if (startNode) { this.start = startNode }
        if (endNode) { this.end = endNode }
        console.log(this.start, this.end)
    }

    private getNeighbors = (x: number, y: number, nodes: Nodes, xMax: number, yMax: number): Graph => {

        let neighborCoordinates: Nodes = [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1],
        ]

        let graphMap: Graph = new Map();

        neighborCoordinates.forEach((coordinate: number[]) => {
            const nx: number = coordinate[0]
            const ny: number = coordinate[1]

            if (nx >= 0 && nx <= xMax && ny >= 0 && ny <= yMax) {
                const edgeStr: string = `${x}-${y}`
                const currentEdges: Distance = graphMap.get(edgeStr) || new Map<string, number>()

                let newEdge: Distance = new Map<string, number>()
                newEdge.set(`${nx}-${ny}`, nodes[ny][nx])

                graphMap.set(edgeStr, new Map([...currentEdges.entries(), ...newEdge.entries()]))
            }
        })

        return graphMap
    }

    private expandMap = (nodes: Nodes): Nodes => {
        const newNodes: Nodes = Array(5 * nodes.length)
            .fill(0)
            .map((_, y) =>
                Array(5 * nodes.length)
                    .fill(0)
                    .map((_, x) => {
                        const originalX = x % nodes.length;
                        const originalY = y % nodes.length;
                        const offset = Math.floor(x / nodes.length) + Math.floor(y / nodes.length);
                        const value = nodes[originalY][originalX] + offset;
                        return value > 9 ? value - 9 : value;
                    })
            )
        return newNodes
    }

    public stringToGraph = (input: string, expand: boolean): Graph => {

        let nodes: Nodes = input.trim().split('\n').map(line => line.split('').map(Number))
        this.nodes = expand ? this.expandMap(nodes) : nodes
        let graph: Graph = new Map()

        const maxRow: number = this.nodes.length - 1
        const maxCol: number = this.nodes[0].length - 1

        this.nodes.forEach((row, rowIndex) => {
            row.forEach((risk, colIndex) => {
                const currGraph: Graph = this.getNeighbors(colIndex, rowIndex, this.nodes, maxCol, maxRow)
                graph = new Map([...graph.entries(), ...currGraph.entries()])
            })
        })

        this.end = `${maxCol}-${maxRow}`
        return graph
    }

    public printGraph = () => {
        console.log(this.nodes.map((v) => v.join("")).join(`\n`))
    }

    public breadFirstSearch = () => {

        let queue: string[] = []
        queue.push(this.start)
        this.distances.set(this.start, 0)
        this.visited = [this.start]

        while (queue.length > 0) {
            let currentNode: string = queue.pop() || ''
            let currentDistance: number = this.distances.get(currentNode)!

            let children: Distance = this.graph.get(currentNode) || {} as Distance

            for (let [child, distance] of children) {
                let newDistance: number = currentDistance + distance

                if (child && this.visited.includes(child)) {
                    if (this.distances.get(child)! > newDistance) {
                        this.distances.set(child, newDistance)
                        this.visited.push(child)
                        queue.push(child)
                    }
                } else if (child && !this.visited.includes(child)) {
                    this.distances.set(child, newDistance)
                    this.visited.push(child)
                    queue.push(child)
                }
            }
        }

    }

    public dijkstra = () => {

        let nodes: string[] = [...this.graph.keys()]
        nodes.map(node => this.distances.set(node, Number.MAX_VALUE))
        this.distances.set(this.start, 0)
        this.visited = []

        while (true) {
            let shortestDistance: number = Number.MAX_VALUE
            let shortestNode: string | null = null

            for (let node of nodes) {
                if (this.distances.get(node)! < shortestDistance && !this.visited.includes(node)) {
                    shortestDistance = this.distances.get(node)!
                    shortestNode = node
                }
            }

            if (!shortestNode) {
                return this.distances
            }

            console.log(`Current node is: ${shortestNode}, distance so far is ${shortestDistance}`)

            let children: Distance = this.graph.get(shortestNode)!

            for (let [child, distance] of children) {
                if (child && this.distances.get(child)! > this.distances.get(shortestNode)! + distance) {
                    this.distances.set(child, this.distances.get(shortestNode)! + distance)
                    console.log("Updating distance of node " + child + " to " + this.distances.get(child))
                }
            }

            this.visited.push(shortestNode)
            // console.log("Visited nodes: " + this.visited)
            // console.log("Currently lowest distances: " + this.distances)
        }
    }

}

const graphTraverser: GraphTraverser = new GraphTraverser(input, true, '0-0')
// graphTraverser.printGraph()
graphTraverser.dijkstra()
console.log(graphTraverser.distances.get(graphTraverser.end))
