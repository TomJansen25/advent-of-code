import scala.io.Source
import scala.collection.mutable.Map

object MonkeyInspector extends App {

    case class Monkey(
       number: Int,
       operator: String,
       operator_num: String,
       test_divide_by: Long,
       throw_to_if_test_true: Int,
       throw_to_if_test_false: Int
     ) {
        var items: List[Long] = List()
        var itemsInspected: Long = 0

        def calculateOperator(input: Long): Long = {
            var x: Long = input
            var res: Long = 0

            if (operator_num != "old") {
                x = operator_num.toLong
            }

            operator match {
                case "*" => res = input * x
                case "+" => res = input + x
                case "-" => res = input - x
                case "/" => res = input / x
            }
            return res
        }

        def testWorryLevel(worryLevel: Long): Long = {
            val throwToMonkey = if (worryLevel % test_divide_by == 0) this.throw_to_if_test_true else this.throw_to_if_test_false
            return throwToMonkey
        }
    }

    val monkeyNumPattern = "Monkey ([0-9]+):".r

    def parseMonkey(input: String): Monkey = {
        val lines = input.split("\n")

        val monkeyNumPattern(monkeyNum) = lines(0)
        val items = lines(1).replace("  Starting items: ", "").split(", ").map(_.toLong)
        val Array(op, num) = lines(2).replace("  Operation: new = old ", "").split(" ")
        val divisor = lines(3).split(" ").last.toLong
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
        def numMonkeys: Int = this.monkeys.size
        def inspections: List[Long] = this.monkeys.values.map(_.itemsInspected).toList
        def monkeyBusiness: Long = this.inspections.sortWith(_ > _).take(2).reduce((acc: Long, item: Long) => acc * item)

        def processAndThrowItem(monkey: Monkey, worryLevel: Long): Unit = {
            val throwToMonkey = monkey.testWorryLevel(worryLevel)
            this.monkeys(monkey.number).items = this.monkeys(monkey.number).items.drop(1)
            this.monkeys(throwToMonkey.toInt).items = worryLevel :: this.monkeys(throwToMonkey.toInt).items
            this.monkeys(monkey.number).itemsInspected = this.monkeys(monkey.number).itemsInspected + 1
            // println(s"Item with worry level ${worryLevel} is thrown from monkey ${currentMonkey.number} to ${throwToMonkey}")
        }

        def processRoundsWithDivision(): Unit = {
            for (i <- 1 to this.rounds) {
                for (i <- 0 until numMonkeys) {
                    val currentMonkey = this.monkeys(i)
                    currentMonkey.items.foreach(item => {
                        val worryLevel = (currentMonkey.calculateOperator(item) / 3).toLong
                        processAndThrowItem(currentMonkey, worryLevel)
                    })
                }
            }
        }

        def processRoundsWithoutDivision(): Unit = {
            for (i <- 1 to this.rounds) {
                for (i <- 0 until numMonkeys) {
                    val currentMonkey = this.monkeys(i)
                    currentMonkey.items.foreach(item => {
                        val worryLevel = currentMonkey.calculateOperator(item)
                        processAndThrowItem(currentMonkey, worryLevel)
                    })
                }
                if (i == 1 || i == 20 || i % 1000 == 0) {
                    println("")
                    println(s"== After round ${i} ==")
                    this.monkeys.values.map(
                        x => println(s"Monkey ${x.number} inspected items ${x.itemsInspected} times")
                    )
                }
            }
        }
    }

    val monkeys = parseInput("testInput.txt")

    val troop = Troop(20)
    monkeys.map(m => troop.monkeys += (m.number -> m))
    troop.processRoundsWithDivision()
    troop.monkeys.values.map(x => println(x.itemsInspected))
    println(s"Part 1 - Monkey business after 20 rounds = ${troop.monkeyBusiness}")

    val monkeys2 = parseInput("testInput.txt")

    val troop2 = Troop(10000)
    monkeys2.map(m => troop2.monkeys += (m.number -> m))
    troop2.processRoundsWithoutDivision()
    // troop2.monkeys.values.map(x => println(s"Monkey ${x.number} inspected items ${x.itemsInspected} times"))
    println(s"Part 2 - Monkey business after 10_000 rounds = ${troop2.monkeyBusiness}")
}