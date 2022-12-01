let die: number = 1
let dieRolls: number = 0

type Player = {
    space: number,
    score: number
}

let player1: Player = { space: 2, score: 0 } // 4
let player2: Player = { space: 10, score: 0 } // 8

function rollDie(dieValue: number) {

    let rollTotal: number = 0

    for (let turn: number = 1; turn <= 3; turn++) {

        if (dieValue > 100) {
            dieValue = 1
        }
        rollTotal += dieValue
        dieValue++
        dieRolls++
    }

    return { dieValue, rollTotal }
}

function movePlayer(playerSpace: number, dieScore: number) {

    const newSpace: number = (playerSpace + dieScore) % 10

    if (newSpace == 0) {
        return 10
    } else
        return newSpace
}

async function main(player1: Player, player2: Player) {
    let goalAchieved: boolean = false
    let currentPlayer: number = 1

    while (!goalAchieved) {

        const player: Player = currentPlayer === 1 ? player1 : player2

        const dieResult1: { dieValue: number, rollTotal: number } = rollDie(die)

        player.space = movePlayer(player.space, dieResult1.rollTotal)

        player.score = player.score + player.space
        die = dieResult1.dieValue

        // console.log(`Player ${currentPlayer} rolls ${dieResult1.rollTotal} and moves to space ${player.space} for a total score of ${player.score}`)

        if (player.score >= 1000) {
            goalAchieved = true
        } else {
            currentPlayer = currentPlayer === 2 ? 1 : 2
        }
    }

    const finalScore = player1.score > player2.score ? dieRolls * player2.score : dieRolls * player1.score
    console.log(dieRolls, player1.score, player2.score, finalScore)

    return { dieRolls, finalScore }
}


const r = main(player1, player2)