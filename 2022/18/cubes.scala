import scala.io.Source
import scala.collection.mutable.Map

object Cubes extends App {

    case class Cube(x: Int, y: Int, z: Int) {
        var exposedSides: Int = 6
        def isAdjacent(other: Cube): Boolean = ((x - other.x).abs + (y - other.y).abs + (z - other.z).abs) == 1

        def getAdjacent(): Array[Cube] = {
            val adjacentCubes = Array(
              Cube(x + 1, y, z), Cube(x - 1, y, z),
              Cube(x, y + 1, z), Cube(x, y - 1, z),
              Cube(x, y, z + 1), Cube(x, y, z - 1),
            )
            return adjacentCubes
        }
    }

    val cubeRegex = """(-?[0-9]+),(-?[0-9]+),(-?[0-9]+)""".r

    def parseCube(input: String): Cube = input match { case cubeRegex(x, y, z) => Cube(x.toInt, y.toInt, z.toInt)}

    def parseInput(filename: String): Array[Cube] = {
        val lines = Source.fromFile(filename).getLines().mkString("\n").trim
        val cubes = lines.split("\n").map(parseCube(_))
        return cubes
    }

    val cubes = parseInput("input.txt")
    val combinations = cubes.combinations(2).toList
    combinations.foreach(comb => {
        val c1 = comb(0)
        val c2 = comb(1)
        if (c1.isAdjacent(c2)) {
            c1.exposedSides = c1.exposedSides - 1
            c2.exposedSides = c2.exposedSides - 1
        }
    })
    println(s"Part 1 - total sum of exposed sides = ${cubes.map(_.exposedSides).sum}")
}