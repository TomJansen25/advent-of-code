import scala.io.Source
import scala.collection.mutable.Map
object Cubes extends App {


    type Cubes = Array[Cube]

    case class Cube(x: Int, y: Int, z: Int) {
        var exposedSides: Int = 6

        def isAdjacent(other: Cube): Boolean = ((x - other.x).abs + (y - other.y).abs + (z - other.z).abs) == 1

        def getAdjacent(): Array[Cube] = {
            val adjacentCubes = Array(
              Cube(x + 1, y, z), Cube(x - 1, y, z),
              Cube(x, y + 1, z), Cube(x, y - 1, z),
              Cube(x, y, z + 1), Cube(x, y, z - 1)
            )
            return adjacentCubes
        }
    }

    val cubeRegex = """(-?[0-9]+),(-?[0-9]+),(-?[0-9]+)""".r

    def parseCube(input: String): Cube = input match { case cubeRegex(x, y, z) => Cube(x.toInt, y.toInt, z.toInt)}

    def parseInput(filename: String): Cubes = {
        val lines = Source.fromFile(filename).getLines().mkString("\n").trim
        val cubes = lines.split("\n").map(parseCube(_))
        return cubes
    }

    def getAdjacentCubes(cubes: Cubes): Cubes = {
        val xMin = cubes.map(_.x).min
        val xMax = cubes.map(_.x).max
        val yMin = cubes.map(_.y).min
        val yMax = cubes.map(_.z).max
        val zMin = cubes.map(_.z).min
        val zMax = cubes.map(_.z).max

        val adjacentCubes = cubes.map(cube => {
            var adjCubes = cube.getAdjacent()
            adjCubes
              .filter(adjC => !cubes.contains(adjC))
              .filter(adjC => (
                adjC.x >= xMin && adjC.x <= xMax &&
                  adjC.y >= yMin && adjC.y <= yMax &&
                  adjC.z >= zMin && adjC.z <= zMax
                )
              )
        }).flatten.distinct
        return adjacentCubes
    }

    def getTrappedCubes(cubes: Cubes, adjacentCubes: Cubes): Cubes = {
        var trappedCubes: List[Cube] = List()
        adjacentCubes.zipWithIndex.foreach { case (adjCube, index) =>
            cubes.foreach(cube => {
                if (adjCube.isAdjacent(cube)) {
                    adjCube.exposedSides = adjCube.exposedSides - 1
                }
            })
            if (adjCube.exposedSides <= 0) trappedCubes = adjCube :: trappedCubes
            if (index % 500 == 0) println(s"Evaluated ${index} cubes...")
        }
        return trappedCubes.distinct.toArray
    }

    val cubes = parseInput("input.txt")

    println("# -------------- Part 1 -------------- #")
    val combinations = cubes.combinations(2).toList
    println(s"Evaluating ${combinations.length} combinations of ${cubes.length} cubes for exposed sides...")
    combinations.foreach(comb => {
        val c1 = comb(0)
        val c2 = comb(1)
        if (c1.isAdjacent(c2)) {
            c1.exposedSides = c1.exposedSides - 1
            c2.exposedSides = c2.exposedSides - 1
        }
    })
    val exposedSides = cubes.map(_.exposedSides).sum
    println(s"Total sum of exposed sides = ${exposedSides}")

    println("")
    println("# -------------- Part 2 -------------- #")
    val adjacentCubes = getAdjacentCubes(cubes)
    println(s"Evaluating ${adjacentCubes.length} adjacent cubes that are potentially trapped...")

    val trappedCubes = getTrappedCubes(cubes, adjacentCubes)
    println(s"Found ${trappedCubes.length} trapped lava droplets")
    println(s"Total sum of exposed sides = ${exposedSides - (trappedCubes.length * 6)}")
}