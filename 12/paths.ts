type Connection = [string, string]

const testInput: string = `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`

function getConnections(f: string): Connection[] {
    const input: [string, string][] = f.split("\n").map(line => {
        const conn = line.split("-")
        return [conn[0], conn[1]]
    })
    const inputLength: number = input.length
    for (let i = 0; i < inputLength; i++) {
        let currConnection: Connection = input[i]

        if (currConnection[0] !== 'start' || currConnection[1] !== 'end') {
            input.push([currConnection[1], currConnection[0]])
        }
    }

    const out: [string, string][] = input.filter(item => (item[1] !== 'start' && item[0] !== 'end'))
    return out
}


async function main(input: string) {
    const connections: Connection[] = getConnections(input)
}

main(testInput)