import scala.io.Source

object RucksackReorganizer extends App {

    def parseInput(filename: String): Array[String] = {
        val lines = Source.fromFile(filename).getLines().mkString("\n").trim
        val rucksacks = lines.split("\n")
        return rucksacks
    }

    def parseGroups(rucksacks: Array[String]): Array[Array[String]] = rucksacks.grouped(3).toArray

    def parseRucksack(rucksack: String): Tuple2[String, String] = rucksack.splitAt(rucksack.length / 2)

    def findItemIntersect(rucksack: Tuple2[String, String]): Array[Char] = {
        return List(rucksack._1.toCharArray(), rucksack._2.toCharArray()).reduce((a, b) => a intersect b).distinct
    }

    def findGroupIntersect(group: Array[String]): Array[Char] = {
        val rucksacks: Array[Array[Char]] = group.map(g => g.toCharArray())
        return rucksacks.toList.reduce((a, b) => a intersect b).distinct
    }

    def itemPriorityScore(item: Char): Int = {
        if ('a' to 'z' contains item)
            return item - 'a' + 1
        else if ('A' to 'Z' contains item)
            return item - 'A' + 27
        else
            throw new Error("invalid character")
    }

    val input = parseInput("input.txt")
    val scores1: Array[Int] = input.map(r => {
        val comps = parseRucksack(r)
        val intersect = findItemIntersect(comps)
        intersect.map(i => itemPriorityScore(i)).sum
    })
    println(s"Part 1: ${scores1.sum}")

    val groups = parseGroups(input)
    val scores2: Array[Int] = groups.map(g => {
        val intersect = findGroupIntersect(g)
        intersect.map(i => itemPriorityScore(i)).sum
    })
    println(s"Part 2: ${scores2.sum}")
}