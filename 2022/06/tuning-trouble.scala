import scala.io.Source

object TuningTrouble extends App {
    def parseInput(filename: String): Array[String] = {
        val lines = Source.fromFile(filename).getLines().mkString("\n").trim
        val packets = lines.split("\n") // .map(_.toCharArray)
        return packets
    }

    def isUniqueChars(str: String): Boolean = str.distinct == str

    def findFirstMarker(packet: String, size: Int): Int = packet.sliding(size).indexWhere(p => isUniqueChars(p)) + size

    val input = parseInput("input.txt")
    input.map(i => println(findFirstMarker(i, 14)))
}