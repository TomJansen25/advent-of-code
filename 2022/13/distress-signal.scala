import scala.io.Source
import scala.util.parsing.json._

object DistressSignal extends App {
    def parseInput(filename: String): Array[Array[String]] = {
        val lines = Source.fromFile(filename).getLines().mkString("\n").trim
        val pairs = lines
          .split("\n\n")
          .map(l => l.split("\n"))
        return pairs
    }

    def parsePairs(pairs: Array[String]) = {
        pairs.zipWithIndex.toString
    }

    val input = parseInput("testInput.txt")
    val first = input(0)
    println(first.map(x => {
        val y = JSON.parseFull(x).toArray
        println(y)
    }))
}