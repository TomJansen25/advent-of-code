import scala.io.Source

object CampCleanup extends App {

    def parseInput(filename: String): Array[Array[Tuple2[Int, Int]]] = {
        val lines = Source.fromFile(filename).getLines().mkString("\n").trim
        val pairs = lines.split("\n")
          .map(l => l.split(",")
            .map(m => {
                val n = m.split("-")
                  .map(n => n.toInt)
                (n(0), n(1))
            })
          )
        return pairs
    }

    def tupleToList(tuple: Tuple2[Int, Int]): List[Int] = (tuple._1 to tuple._2).toList

    def getIntersect(pairs: Array[Tuple2[Int, Int]]): List[Int] = {
        val r1 = tupleToList(pairs(0))
        val r2 = tupleToList(pairs(1))
        return List(r1, r2).reduce((a, b) => a intersect b).distinct
    }

    def isSublist(list1: List[Int], list2: List[Int]): Boolean = list1.forall(list2.contains)

    val input = parseInput("input.txt")
    var res1 = 0
    var res2 = 0
    input.map(i => {
        val intersect = getIntersect(i)
        if (!intersect.isEmpty)
            res2 += 1
        val fullyContainsA = isSublist(tupleToList(i(0)), intersect)
        val fullyContainsB = isSublist(tupleToList(i(1)), intersect)
        if (fullyContainsA == true || fullyContainsB == true)
            res1 += 1
    })
    println(s"Part 1: ${res1}")
    println(s"Part 2: ${res2}")

}
