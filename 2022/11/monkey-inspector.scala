import scala.io.Source
import scala.collection.mutable.Map

object MonkeyInspector extends App {

    case class Monkey(
       number: Int,
       operator: String,
       operator_num: String,
       test_divide_by: Int,
       throw_to_if_test_true: Int,
       throw_to_if_test_false: Int
     ) {
        var items: List[Int] = List()
        var itemsInspected: Int = 0

        def calculateOperator(input: Int): Int = {
            var x: Int = input
            var res: Int = 0

            if (operator_num != "old") {
                x = operator_num.toInt
            }

            operator match {
                case "*" => res = input * x
                case "+" => res = input + x
                case "-" => res = input - x
                case "/" => res = input / x
            }
            return res
        }

        def testWorryLevel(worryLevel: Int): Int = {
            val throwToMonkey = if (worryLevel % test_divide_by == 0) this.throw_to_if_test_true else this.throw_to_if_test_false
            return throwToMonkey
        }
    }

    val monkeyNumPattern = "Monkey ([0-9]+):".r

    def parseMonkey(input: String): Monkey = {
        val lines = input.split("\n")

        val monkeyNumPattern(monkeyNum) = lines(0)
        val items = lines(1).replace("  Starting items: ", "").split(", ").map(_.toInt)
        val Array(op, num) = lines(2).replace("  Operation: new = old ", "").split(" ")
        val divisor = lines(3).split(" ").last.toInt
        val throw_if_true = lines(4).last.asDigit
        val throw_if_false = lines(5).last.asDigit

        val monkey = Monkey(
            number = monkeyNum.toInt,
            operator = op,
            operator_num = num,
            test_divide_by = divisor,
            throw_to_if_test_true = throw_if_true,
            throw_to_if_test_false = throw_if_false
        )
        monkey.items = items.toList
        return monkey
    }


    def parseInput(filename: String): Array[Monkey] = {
        val lines = Source.fromFile(filename).getLines().mkString("\n").trim
        val splittedMonkeys = lines.split("\n\n")
        val monkeys = splittedMonkeys.map(parseMonkey(_))
        return monkeys
    }

    case class Troop(rounds: Int) {
        var monkeys: Map[Int, Monkey] = Map[Int, Monkey]()

        def processRounds(): Unit = {
            for (i <- 1 to this.rounds) {
                for (i <- 0 until numMonkeys) {
                    val currentMonkey = this.monkeys(i)
                    currentMonkey.items.foreach(item => {
                        val worryLevel = (currentMonkey.calculateOperator(item) / 3).toInt
                        val throwToMonkey = currentMonkey.testWorryLevel(worryLevel)
                        currentMonkey.items = currentMonkey.items.drop(1)
                        this.monkeys(throwToMonkey).items = this.monkeys(throwToMonkey).items ::: List(worryLevel)
                        currentMonkey.itemsInspected = currentMonkey.itemsInspected + 1
                        println(s"Item with worry level ${worryLevel} is thrown from monkey ${currentMonkey.number} to ${throwToMonkey}")
                    })
                }
            }
        }
    }

    val monkeys = parseInput("input.txt")
    val numMonkeys = monkeys.length

    val troop = Troop(20)
    monkeys.map(m => troop.monkeys += (m.number -> m))
    troop.processRounds()
    troop.monkeys.values.map(x => println(x.itemsInspected))
}