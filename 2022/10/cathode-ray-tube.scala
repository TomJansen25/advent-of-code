import scala.io.Source
import scala.collection.mutable.Map

object ClockCircuit extends App {

    def parseInput(filename: String): Array[String] = {
        val lines = Source.fromFile(filename).getLines().mkString("\n").trim
        val commands = lines.split("\n")
        return commands
    }

    val addRegex = """addx (-?[0-9]+)""".r

    class ClockCircuit(instructions: Array[String]) {
        var X: Int = 1
        var cycle: Int = 0
        var signalStrenghts: Map[Int, Int] = Map[Int, Int]()
        var CRT: Array[String] = Array.fill[String](240)(".")

        def printCRT(): Unit = println(this.CRT.grouped(40).toList.map(x => x.mkString).mkString("\n"))

        def updateCRT(): Unit = if (((this.X - 1 to this.X + 1).contains((cycle - 1) % 40))) this.CRT(this.cycle) = "#"

        def checkCycle(): Unit = {
            if ((this.cycle % 20 == 0 || this.cycle % 20 == 1) && (this.cycle % 40 != 0 && this.cycle % 40 != 1)) {
                val cycle = this.cycle.toString.dropRight(1).toInt * 10
                if (!this.signalStrenghts.contains(cycle))
                    this.signalStrenghts += (cycle -> cycle * this.X)
            }
        }

        def parseSignal(signal: String) = {
            println(signal)

            signal match {
                case "noop" => {
                    this.cycle = this.cycle + 1
                    updateCRT()
                    checkCycle()
                }
                case addRegex(x) => {
                    this.cycle = this.cycle + 1
                    updateCRT()
                    checkCycle()

                    this.cycle = this.cycle + 1
                    updateCRT()
                    checkCycle()

                    this.X = this.X + x.toInt
                }
                case _ => println("Couldn't match...")
            }

            println(s"Value of X at Cycle ${this.cycle} = ${this.X}")
        }

        def parseInstructions(): Unit = {
            instructions.foreach(parseSignal(_))
        }
    }

    val input = parseInput("input.txt")
    val cc = new ClockCircuit(input)
    cc.parseInstructions()
    println(s"Signal Strengths: ${cc.signalStrenghts}")
    println(s"Signal Strenghts sum: ${cc.signalStrenghts.values.sum}")
    cc.printCRT()
}