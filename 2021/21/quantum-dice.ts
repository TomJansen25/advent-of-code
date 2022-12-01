
//create a map of the dice and outcomes, so we done have to calculate it for each dimension
let diceMap = new Map<number, number>();
for (let diceOne = 1; diceOne <= 3; diceOne++) {
    for (let diceTwo = 1; diceTwo <= 3; diceTwo++) {
        for (let diceThree = 1; diceThree <= 3; diceThree++) {
            const outcome = diceOne + diceTwo + diceThree
            diceMap.set(outcome, (diceMap.get(outcome) || 0) + 1)
        }
    }
}

const outcomes = [...diceMap.keys()]
const maxOutcome = Math.max(...diceMap.values())
const minOutcome = Math.min(...diceMap.values())

console.log(diceMap)
console.log(outcomes)