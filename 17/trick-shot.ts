type TargetRange = { minX: number, maxX: number, minY: number, maxY: number }

type Velocity = { dx: number, dy: number }

type Position = { x: number, y: number }

function checkPosition(position: Position, targetRange: TargetRange): boolean {

    if (position.x >= targetRange.minX && position.x <= targetRange.maxX && position.y >= targetRange.minY && position.y <= targetRange.maxY) {
        return true
    } else {
        return false
    }

}


function calculateTrajectory(velocity: Velocity, targetRange: TargetRange) {

    const initialVelocity: Velocity = { ...velocity }
    let position: Position = { x: 0, y: 0 }
    let yPositions: number[] = []
    let targetReached: boolean = false
    let continueSearching: boolean = true

    while (continueSearching) {

        position.x = position.x + velocity.dx
        position.y = position.y + velocity.dy

        yPositions.push(position.y)

        if (velocity.dx > 0) { velocity.dx = velocity.dx - 1 }
        if (velocity.dx < 0) { velocity.dx = velocity.dx + 1 }

        velocity.dy = velocity.dy - 1

        targetReached = checkPosition(position, targetRange)
        if (targetReached) {
            // console.log(`Target reached at Position ${position.x}, ${position.y} with Velocity ${initialVelocity.dx}, ${initialVelocity.dy}`)
            continueSearching = false
        }
        if (position.x > targetRange.maxX || position.y < targetRange.minY) {
            // console.log(`Target overshot at Position ${position.x}, ${position.y} with Velocity ${initialVelocity.dx}, ${initialVelocity.dy}`)
            continueSearching = false
        }

    }

    return { targetReached, yPositions }
}


function findVelocities(targetRange: TargetRange) {

    // const maxX: number = targetRange.maxX
    const maxX: number = targetRange.minX
    const maxY: number = targetRange.minY * -1

    const successfulVelocities: Velocity[] = []
    const heights: number[] = []

    for (let x: number = 0; x <= maxX; x++) {
        for (let y: number = targetRange.minY; y <= maxY; y++) {
            const velocity: Velocity = { dx: x, dy: y }
            let { targetReached, yPositions } = calculateTrajectory(velocity, targetRange)
            if (targetReached) {
                successfulVelocities.push(velocity)
                heights.push(Math.max.apply(Math, yPositions))
            }
        }
    }

    return { successfulVelocities, heights }

}

/*
target area: x=20..30, y=-10..-5
target area: x=94..151, y=-156..-103
*/


async function main() {
    const targetRange: TargetRange = { minX: 94, maxX: 151, minY: -156, maxY: -103 }
    const { successfulVelocities, heights } = findVelocities(targetRange)
    console.log(successfulVelocities.length)
    console.log(Math.max.apply(Math, heights))
}

main()