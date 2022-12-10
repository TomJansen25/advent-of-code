import scala.io.Source
import scala.collection.mutable.Set
import scala.math.abs

object RopeBridge extends App {

    case class Position(x: Int, y: Int)
    case class Move(direction: String, steps: Int)

    val xMotion = Map("R" -> 1, "L" -> -1, "U" -> 0, "D" -> 0)
    val yMotion = Map("U" -> 1, "D" -> -1, "R" -> 0, "L" -> 0)

    def parseInput(filename: String): Array[String] = {
        val lines = Source.fromFile(filename).getLines().mkString("\n").trim
        val motions = lines.split("\n")
        return motions
    }

    def followHead(head: Position, tail: Position): Position = {
        val xDiff = head.x - tail.x
        val xUpdate = if (xDiff > 0) 1 else -1

        val yDiff = head.y - tail.y
        val yUpdate = if (yDiff > 0) 1 else -1

        var newTail = tail

        if ((xDiff.abs > 1 && yDiff.abs > 0) || (xDiff.abs > 0 && yDiff.abs > 1)) {
            println("Diagonal move required")
            newTail = Position(tail.x + xUpdate, tail.y + yUpdate)
        } else if (xDiff.abs > 1) {
            println("Move in X direction required")
            newTail = Position(tail.x + xUpdate, tail.y)
        } else if (yDiff.abs > 1) {
            println("Move in Y direction required")
            newTail = Position(tail.x, tail.y + yUpdate)
        } else println("Couldn't determine what to do...")

        return newTail
    }

    def applyMotion(move: Move, head: Position, tail: Position, visitedPositions: List[Position]): Tuple3[Position, Position, List[Position]] = {
        var newHead = head
        var newTail = tail
        val xDiff = xMotion(move.direction)
        val yDiff = yMotion(move.direction)

        var newVisitedPositions = visitedPositions

        for (i <- 1 to move.steps) {
            newHead = Position(newHead.x + xDiff, newHead.y + yDiff)
            println(s"Head moved to: ${newHead}")
            newTail = followHead(newHead, newTail)
            println(s"Tail moved to: ${newTail}")
            newVisitedPositions = List(newTail) ::: newVisitedPositions
        }
        return (newHead, newTail, newVisitedPositions)
    }

    var h = Position(0, 0)
    var t = Position(0, 0)
    var visitedPositions: List[Position] = List()

    val motions = parseInput("input.txt")

    motions.foreach(motion => {
        val move = Move(motion.take(1), motion.takeRight(1).toInt)
        var (newHead, newTail, newVisitedPositions) = applyMotion(move, h, t, visitedPositions)
        h = newHead
        t = newTail
        visitedPositions = newVisitedPositions
    })

    // println(s"Visited positions: ${visitedPositions}")
    println(visitedPositions.distinct.length)

}