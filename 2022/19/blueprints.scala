import scala.io.Source

object Blueprints extends App {

    val blueprintRegex = """Blueprint (\d+):""".r
    val oreRobotRegex = """Each ore robot costs (\d+) ore.""".r
    val clayRobotRegex = """Each clay robot costs (\d+) ore.""".r
    val obsidianRobotRegex = """Each obsidian robot costs (\d+) ore and (\d+) clay.""".r
    val geodeRobotRexeg = """Each geode robot costs (\d+) ore and (\d+) obsidian.""".r

    case class Blueprint(
        number: Int, ore_robot_ore_costs: Int, clay_robot_ore_costs: Int, obsidian_robot_ore_costs: Int,
        obsidian_robot_clay_costs: Int, geode_robot_ore_costs: Int, geode_robot_obsidian_costs: Int
    ) {
        def maxOre: Int = Array(ore_robot_ore_costs, clay_robot_ore_costs, obsidian_robot_ore_costs, geode_robot_ore_costs).max
    }

    def parseBlueprint(input: String): Blueprint = {
        val lines = input.split("\n").map(_.trim)
        val num = lines(0) match { case blueprintRegex(num) => num }
        val ore_robot = lines(1) match { case oreRobotRegex(ore) => ore }
        val clay_robot = lines(2) match { case clayRobotRegex(ore) => ore }
        val Array(obsidian_ore, obsidian_clay) = lines(3) match {
            case obsidianRobotRegex(ore, geode) => Array(ore, geode)
        }
        val Array(geode_ore, geode_obsidian) = lines(4) match {
            case geodeRobotRexeg(ore, obsidian) => Array(ore, obsidian)
        }
        return Blueprint(
            num.toInt, ore_robot.toInt, clay_robot.toInt,
            obsidian_ore.toInt, obsidian_clay.toInt, geode_ore.toInt, geode_obsidian.toInt
        )
    }

    def parseInput(filename: String): Array[Blueprint] = {
        val lines = Source.fromFile(filename).getLines().mkString("\n").trim
        val blueprints = lines.split("\n\n").map(parseBlueprint(_))
        return blueprints
    }

    def maximize_num_geodes(
        ore: Int, oreRobots: Int, clay: Int, clayRobots: Int, obsidian: Int, obsidianRobots: Int,
        geode: Int, geodeRobots: Int, minutes: Int, currentMinute: Int, blueprint: Blueprint
    ): Int = {
        val (newOre, newClay, newObsidian, newGeode) = (
          ore + oreRobots, clay + clayRobots, obsidian + obsidianRobots, geode + geodeRobots
        )
        println(s"====== Minute : ${currentMinute} =====")
        if (currentMinute == 12) return geode
        if (obsidian >= blueprint.geode_robot_obsidian_costs && ore >= blueprint.geode_robot_ore_costs) {
            println(s"Spend ${blueprint.geode_robot_obsidian_costs} obsidian and ${blueprint.geode_robot_ore_costs} ore to build a geode-robot")
            println(s"Current resources: ${newOre - blueprint.geode_robot_ore_costs} ore, ${newClay} clay, ${newObsidian - blueprint.geode_robot_obsidian_costs}, obsidian, and ${newGeode} geode")
            return maximize_num_geodes(
                ore = newOre - blueprint.geode_robot_ore_costs, oreRobots = oreRobots,
                clay = newClay, clayRobots = clayRobots,
                obsidian = newObsidian - blueprint.geode_robot_obsidian_costs, obsidianRobots = obsidianRobots,
                geode = newGeode, geodeRobots = geodeRobots + 1,
                minutes = minutes, currentMinute = currentMinute + 1, blueprint = blueprint
            )
        }
        if (clay >= blueprint.obsidian_robot_clay_costs && ore >= blueprint.obsidian_robot_ore_costs) {
            println(s"Spend ${blueprint.obsidian_robot_clay_costs} clay and ${blueprint.obsidian_robot_ore_costs} ore to build an obsidian-robot")
            println(s"Current resources: ${newOre - blueprint.obsidian_robot_ore_costs} ore, ${newClay - blueprint.obsidian_robot_clay_costs} clay, ${newObsidian}, obsidian, and ${newGeode} geode")
            return maximize_num_geodes(
                ore = newOre - blueprint.obsidian_robot_ore_costs, oreRobots = oreRobots,
                clay = newClay - blueprint.obsidian_robot_clay_costs, clayRobots = clayRobots,
                obsidian = newObsidian, obsidianRobots = obsidianRobots + 1,
                geode = newGeode, geodeRobots = geodeRobots,
                minutes = minutes, currentMinute = currentMinute + 1, blueprint = blueprint
            )
        }
        var (optionA, optionB, optionC) = (0, 0, 0)
        if (ore >= blueprint.clay_robot_ore_costs) {
            println(s"Spend ${blueprint.clay_robot_ore_costs} ore to build a clay-robot")
            println(s"Current resources: ${newOre - blueprint.clay_robot_ore_costs} ore, ${newClay} clay, ${newObsidian}, obsidian, and ${newGeode} geode")
            optionA = maximize_num_geodes(
                ore = newOre - blueprint.clay_robot_ore_costs, oreRobots = oreRobots,
                clay = newClay, clayRobots = clayRobots + 1,
                obsidian = newObsidian, obsidianRobots = obsidianRobots,
                geode = newGeode, geodeRobots = geodeRobots,
                minutes = minutes, currentMinute = currentMinute + 1, blueprint = blueprint
            )
        }
        if (ore >= blueprint.ore_robot_ore_costs) {
            println(s"Spend ${blueprint.ore_robot_ore_costs} ore to build an ore-robot")
            println(s"Current resources: ${newOre - blueprint.ore_robot_ore_costs} ore, ${newClay} clay, ${newObsidian}, obsidian, and ${newGeode} geode")
            optionB = maximize_num_geodes(
                ore = newOre - blueprint.ore_robot_ore_costs, oreRobots = oreRobots + 1,
                clay = newClay, clayRobots = clayRobots,
                obsidian = newObsidian, obsidianRobots = obsidianRobots,
                geode = newGeode, geodeRobots = geodeRobots,
                minutes = minutes, currentMinute = currentMinute + 1, blueprint = blueprint
            )
        }
        if (ore < 4) {
            println(s"Don't spend any ore to save up for something better")
            println(s"Current resources: ${newOre} ore, ${newClay} clay, ${newObsidian}, obsidian, and ${newGeode} geode")
            optionC = maximize_num_geodes(
                ore = newOre, oreRobots = oreRobots, clay = newClay, clayRobots = clayRobots,
                obsidian = newObsidian, obsidianRobots = obsidianRobots, geode = newGeode, geodeRobots = geodeRobots,
                minutes = minutes, currentMinute = currentMinute + 1, blueprint = blueprint
            )
        }
        return Array(optionA, optionB, optionC).max
    }

    val blueprints = parseInput("testInput.txt")
    val geodes = maximize_num_geodes(0, 1, 0, 0, 0, 0, 0, 0, 24, 1, blueprints(0))
    println(s"Max geodes = ${geodes}")
}