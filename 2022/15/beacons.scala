import scala.io.Source
import scala.collection.mutable.Map
import annotation.{tailrec => tco}

object Beacons extends App {

    case class Coordinate(x: Int, y: Int) {

        def getDistanceUntil(other: Coordinate): Int = (x - other.x).abs + (y - other.y).abs

        def getRangesUntilDistance(distance: Int): List[Tuple2[Int, Range]] = {
            val otherCoors: List[Tuple2[Int, Range]] = (y - distance to y + distance).map(yy => {
                val xDiff = ((yy - y).abs - distance).abs
                val xRange = Range.inclusive(x - xDiff, x + xDiff)
                (yy, xRange)
            }).toList
            return otherCoors
        }
    }

    case class Beacon(x: Int, y: Int) {
        def toCoordinate(): Coordinate = Coordinate(x, y)
        def getTuningFrequency(): Long = x.toLong * 4000000 + y.toLong
    }

    case class Sensor(x: Int, y: Int, closestBeacon: Beacon) {
        def xClosestDiff: Int = (x - closestBeacon.x).abs

        def yClosestDiff: Int = (y - closestBeacon.y).abs

        def closestBeaconDiff(): Int = xClosestDiff + yClosestDiff

        def getNonBeaconCoordinates(): List[Tuple2[Int, Range]] = {
            val coor = Coordinate(x, y)
            var nonBeacons = coor.getRangesUntilDistance(closestBeaconDiff)
            return nonBeacons
        }
    }

    def parseInput(filename: String): Tuple2[Array[Beacon], Array[Sensor]] = {
        val lines = Source.fromFile(filename).getLines().mkString("\n").trim
        val parsed = lines
          .split("\n")
          .map(parseSensorString(_))
        val beacons = parsed.map(_._1)
        val sensors = parsed.map(_._2)
        return (beacons, sensors)
    }

    val sensorRegex = """Sensor at x=(-?[0-9]+), y=(-?[0-9]+): closest beacon is at x=(-?[0-9]+), y=(-?[0-9]+)""".r

    def parseSensorString(input: String): Tuple2[Beacon, Sensor] = {
        input match {
            case sensorRegex(sx, sy, bx, by) => (
              Beacon(bx.toInt, by.toInt),
              Sensor(sx.toInt, sy.toInt, Beacon(bx.toInt, by.toInt))
            )
        }
    }

    // StackOverflow item: https://stackoverflow.com/questions/9218891/how-to-functionally-merge-overlapping-number-ranges-from-a-list
    @tco final def collapse(rs: List[Range], sep: List[Range] = Nil): List[Range] = rs match {
        case x :: y :: rest =>
            if (y.start - 1 > x.end) collapse(y :: rest, x :: sep)
            else collapse(Range.inclusive(x.start, x.end max y.end) :: rest, sep)
        case _ =>
            (rs ::: sep).reverse
    }

    def merge(rs: List[Range]): List[Range] = collapse(rs.sortBy(_.start))

    def findTuningFrequency(nonBeacons: Array[Tuple2[Int, Range]], target: Int): Unit = {
        for (y <- 0 to target) {
            val curr = nonBeacons.filter(_._1 == y).map(_._2).toList
            val mergedRanges = merge(curr)
            if (mergedRanges.length > 1) {
                val missing = (mergedRanges.head.end + 1).toLong
                println(s"Part 2 - Tuning Frequency at y=${y} = ${y.toLong + (target * missing)}")
            }
        }
    }

    println("Starting...")
    val (inputBeacons, input) = parseInput("input.txt")
    val target = 2000000
    val xBeacons = inputBeacons.map(_.toCoordinate).filter(_.y == target).distinct.map(_.x)
    val nonBeacons = input.map(i => {i.getNonBeaconCoordinates()})
    var xSensors = nonBeacons
      .flatten
      .filter(_._1 == target)
      .map(_._2.toArray)
      .flatten
      .distinct
      .filter(!xBeacons.contains(_))
    println(s"Part 1 - non-beacon positions on row y = ${target} is ${xSensors.length}")

    val potentialDistressBeacons = nonBeacons
      .flatten
      .filter(b => {b._1 >= 0 && b._1 <= target * 2})
    findTuningFrequency(potentialDistressBeacons, target * 2)
}
