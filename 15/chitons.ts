const testInput: number[][] = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`.split("\n").map(line => line.split("").map(Number))

const maxRow: number = testInput.length - 1
const maxCol: number = testInput[0].length - 1


type GraphNode = {
    start: string;
    end: string;
    risk: number;
}

type Distance = Map<string, number>

type Edge = Map<string, Distance>

function getNeighbors(x: number, y: number, heatmap: number[][]): Edge {

    let neighborCoordinates: number[][] = [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
    ]

    let edgeMap: Edge = new Map();

    neighborCoordinates.forEach((coordinate: number[]) => {
        const nx: number = coordinate[0]
        const ny: number = coordinate[1]

        if (nx >= 0 && nx <= maxCol && ny >= 0 && ny <= maxRow) {
            const edgeStr: string = `${x}-${y}`
            const currentEdges: Distance = edgeMap.get(edgeStr) || new Map<string, number>()

            let newEdge: Distance = new Map<string, number>()
            newEdge.set(`${nx}-${ny}`, heatmap[ny][nx])

            edgeMap.set(edgeStr, new Map([...currentEdges.entries(), ...newEdge.entries()]))
        }
    })

    return edgeMap

}


let edges: Edge = new Map()

testInput.forEach((row, rowIndex) => {
    row.forEach((risk, colIndex) => {

        const currEdgeMap: Edge = getNeighbors(colIndex, rowIndex, testInput)

        edges = new Map([...edges.entries(), ...currEdgeMap.entries()])
    })
})

// console.log(edges.length)
console.log(edges)


class Graph {
    nodes: GraphNode[]

    constructor(nodes: GraphNode[]) {
        this.nodes = nodes;
    }

    dijkstra() {

    }

}
