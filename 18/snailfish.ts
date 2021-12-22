

function split(num: number): [number, number] {

    const numLeft: number = Math.floor(num / 2)
    const numRight: number = Math.ceil(num / 2)

    return [numLeft, numRight]
}

function reduce() {
    return ''
}

function explode() {
    return ''
}

let foo = [["a", ["b", "c"]], ["a", "b", "c"], ["a", "b", "c"]];
let bar = foo.flat(10)

console.log(bar)