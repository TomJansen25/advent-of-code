import scala.io.Source
import scala.collection.mutable.Map
object MonkeyMath extends App {

    val intRegex = "(\\d+)".r

    case class Monkey(name: String, number: Option[Long], input: Option[String]) {
        var finalNumber = number
        var nameOtherMonkeyA: Option[String] = None
        var otherMonkeyA: Option[Monkey] = None
        var nameOtherMonkeyB: Option[String] = None
        var otherMonkeyB: Option[Monkey] = None
        var operator: Option[String] = None

        def parseInput() = {
            if (this.input.isEmpty == false) {
                val Array(mA, op, mB) = input.get.split(" ")
                nameOtherMonkeyA = Some(mA)
                operator = Some(op)
                nameOtherMonkeyB = Some(mB)
            } else println("Input is empty and doesn't have to be parsed...")
        }

        def findMonkey(otherName: String, monkeys: Array[Monkey]): Option[Monkey] = {
            val foundMonkeys = monkeys.filter(_.name == otherName)
            if (foundMonkeys.length == 0) return None
            else return Some(foundMonkeys(0))
        }

        def calcNumber(): Unit = {
            val numA = otherMonkeyA.get.finalNumber
            val numB = otherMonkeyB.get.finalNumber
            if (numA.isEmpty == false && numB.isEmpty == false) {
                operator.get match {
                    case "+" => finalNumber = Some(numA.get + numB.get)
                    case "-" => finalNumber = Some(numA.get - numB.get)
                    case "*" => finalNumber = Some(numA.get * numB.get)
                    case "/" => finalNumber = Some(numA.get / numB.get)
                }
            }
        }
    }

    type Monkeys = Array[Monkey]

    def parseInput(filename: String): Monkeys = {
        val lines = Source.fromFile(filename).getLines().mkString("\n").trim
        val monkeys = lines.split("\n").map(line => {
            val Array(name, input) = line.split(": ")
            val monkey = input match {
                case intRegex(x) => Monkey(name, Some(x.toLong), None)
                case _ => Monkey(name, None, Some(input))
            }
            monkey.parseInput()
            monkey
        })
        return monkeys
    }

    def findMonkeyNumber(monkeyName: String, monkeys: Monkeys) = {
        var keepSearching = true

        while (keepSearching) {
            monkeys.foreach(monkey => {
                if (monkey.finalNumber.isEmpty) {
                    monkey.otherMonkeyA = monkey.findMonkey(monkey.nameOtherMonkeyA.get, monkeys)
                    monkey.otherMonkeyB = monkey.findMonkey(monkey.nameOtherMonkeyB.get, monkeys)
                    monkey.calcNumber()
                }
            })
            val rootNumber = monkeys.filter(_.name == "root")(0).finalNumber
            if (rootNumber.isEmpty == false) {
                println(s"Final Number of root monkey = ${rootNumber.get}")
                keepSearching = false
            }
        }
    }

    val monkeys = parseInput("input.txt")
    findMonkeyNumber("root", monkeys)
}