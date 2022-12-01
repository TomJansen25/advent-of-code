import scala.io.Source

object CalorieCounter extends App {

    def parseInput(filename: String): Array[String] = {
        val lines = Source.fromFile(filename).getLines().mkString("\n").trim
        val elves = lines.split("\n\n")
        return elves
    }

    def parseElf(calories: String): Int = calories.split("\n").map(_.toInt).sum

    def parseElves(elves: Array[String]): Array[Int] = elves.map(parseElf)

    def getMaxElf(input: Array[String]): Int = parseElves(input).max

    def getMax3Elf(input: Array[String]): Int = parseElves(input).sorted.reverse.take(3).sum

    val input = parseInput("input.txt")
    println(getMaxElf(input))
    println(getMax3Elf(input))
}