import scala.io.Source

object RockPaperScissors extends App {

    def parseInput(filename: String): Array[Array[String]] = {
        val lines = Source.fromFile(filename).getLines().mkString("\n").trim
        val input = lines.split("\n").map(s => s.split(" "))
        return input
    }

    val choiceMap: Map[String, String] = Map(
        "A" -> "Rock",
        "B" -> "Paper",
        "C" -> "Scissors",
        "X" -> "Rock",
        "Y" -> "Paper",
        "Z" -> "Scissors"
    )

    val outcomePointsMap: Map[String, Int] = Map(
        "X" -> 0,
        "Y" -> 3,
        "Z" -> 6
    )

    val choicePointsMap: Map[String, Int] = Map(
        "Rock" -> 1,
        "Paper" -> 2,
        "Scissors" -> 3
    )

    def calcPoints(opp: String, you: String): Int = {
        var points = 0
        (opp, you) match {
            case ("Rock", "Paper") => points = 6
            case ("Paper", "Scissors") => points = 6
            case ("Scissors", "Rock") => points = 6
            case ("Rock", "Scissors") => points = 0
            case ("Paper", "Rock") => points = 0
            case ("Scissors", "Paper") => points = 0
            case _ => points = 3
        }
        return points + choicePointsMap(you)
    }

    def calcOutcome(opp: String, you: String): Int = {
        var points: Tuple2[String, Int] = ("", 0)

        (opp, you) match {
            case ("Rock", "X") => points = ("Scissors", 0)
            case ("Paper", "X") => points = ("Rock", 0)
            case ("Scissors", "X") => points = ("Paper", 0)
            case (opp, "Y") => points = (opp, 3)
            case ("Rock", "Z") => points = ("Paper", 6)
            case ("Paper", "Z") => points = ("Scissors", 6)
            case ("Scissors", "Z") => points = ("Rock", 6)
        }
        return choicePointsMap(points._1) + points._2
    }

    val input = parseInput("input.txt")

    val procInput1 = input.map(s => (choiceMap(s(0)), choiceMap(s(1))))
    val points1: Array[Int] = procInput1.map(i => calcPoints(i._1, i._2))
    println(s"Part 1: ${points1.sum}")

    val procInput2 = input.map(s => (choiceMap(s(0)), s(1)))
    val points2: Array[Int] = procInput2.map(i => calcOutcome(i._1, i._2))
    println(s"Part 2: ${points2.sum}")
}