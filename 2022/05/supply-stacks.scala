import scala.io.Source
import scala.collection.mutable.Map

object SupplyStacks extends App {

    case class Move(count: Int, from: Int, to: Int)

    type Crates = Map[Int, List[Char]]

    val moveRegex = """move (\d+) from (\d+) to (\d+)""".r

    def parseMove(s: String): Move = s match {
        case moveRegex(count, from, to) => Move(count.toInt, from.toInt, to.toInt)
    }

    def filterOutOnlyDots(l: List[Char]): Boolean = {
        if (l.distinct == List(".".charAt(0))) {
            return false
        } else
            return true
    }

    def parseCrates(crates: String): Crates = {
        val lines: Array[List[Char]] = crates
          .split("\n")
          .map(s => {
              s
                .replaceAll("[\\[\\]]", " ")
                .replaceAll(" ", ".")
                .toCharArray
                .toList
                .drop(1)
          })

        val finalLength = lines.last.length

        val finalLines: Array[List[Char]] = lines.map(l => {
            if (l.length > finalLength) {
                val diff = l.length - finalLength
                l.dropRight(diff)
            } else if (l.length < finalLength) {
                val diff = finalLength - l.length
                l ::: List.fill(diff)(".".charAt(0))
            } else l
        })

        val linesTransp = finalLines
          .toList
          .transpose
          .filter(filterOutOnlyDots)
          .map(s => s.filter(t => t != ".".charAt(0)))

        var parsedCrates = scala.collection.mutable.Map[Int, List[Char]]()
        linesTransp.foreach(crate => {
            parsedCrates += (crate.last.asDigit -> crate.dropRight(1))
        })
        return parsedCrates
    }

    def parseInput(filename: String): Tuple2[Crates, Array[Move]] = {
        val lines = Source.fromFile(filename).getLines().mkString("\n")
        val Array(crateLines, moveLines) = lines.split("\n\n")
        val crates = parseCrates(crateLines)
        val moves = moveLines.split("\n").map(parseMove(_))
        return (crates, moves)
    }

    def getTopCrates(crates: Crates): String = {
        var finals = ""
        for (i <- 1 to crates.size) {
            finals += crates(i).head.toString
        }
        return finals
    }

    def applyMove9000(crates: Crates, move: Move): Crates = {
        for (i <- 1 to move.count) {
            val toMove = crates(move.from).head
            crates(move.from) = crates(move.from).tail
            crates(move.to) = List(toMove) ::: crates(move.to)
        }
        // println(s"Crates after move: ${crates}")
        return crates
    }

    def applyMove9001(crates: Crates, move: Move): Crates = {
        val toMove = crates(move.from).take(move.count)
        crates(move.from) = crates(move.from).drop(move.count)
        crates(move.to) = toMove ::: crates(move.to)
        // println(s"Crates after move: ${crates}")
        return crates
    }

    var (crates1, moves1) = parseInput("input.txt")
    moves1.foreach(move => {
        crates1 = applyMove9000(crates1, move)
    })
    println(s"Part 1: ${getTopCrates(crates1)}")

    var (crates2, moves2) = parseInput("input.txt")
    moves2.foreach(move => {
        crates2 = applyMove9001(crates2, move)
    })
    println(s"Part 2: ${getTopCrates(crates2)}")
}
