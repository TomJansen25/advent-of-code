import scala.io.Source

object Blueprints extends App {

    val blueprintRegex = """Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian.""".r

    case class Blueprint(
        number: Int, ore_robot_ore_costs: Int, clay_robot_ore_costs: Int, obsidian_robot_ore_costs: Int,
        obsidian_robot_clay_costs: Int, geode_robot_ore_costs: Int, geode_robot_obsidian_costs: Int
    ) {
        def maxOre: Int = Array(ore_robot_ore_costs, clay_robot_ore_costs, obsidian_robot_ore_costs, geode_robot_ore_costs).max
        def maxClay: Int = obsidian_robot_clay_costs
        def maxObsidian: Int = geode_robot_obsidian_costs

    }

    def parseBlueprint(input: String): Blueprint = {
        input match {
            case blueprintRegex(num, ore_ore, clay_ore, obsidian_ore, obsidian_clay, geode_ore, geode_obsidian) =>
                Blueprint(
                    num.toInt, ore_ore.toInt, clay_ore.toInt, obsidian_ore.toInt, obsidian_clay.toInt,
                    geode_ore.toInt, geode_obsidian.toInt
                )
        }
    }

    def parseInput(filename: String): Array[Blueprint] = {
        val lines = Source.fromFile(filename).getLines().mkString("\n").trim
        val blueprints = lines.split("\n").map(parseBlueprint(_))
        return blueprints
    }

    def maximize_num_geodes(
        ore: Int, oreRobots: Int, clay: Int, clayRobots: Int, obsidian: Int, obsidianRobots: Int,
        geode: Int, geodeRobots: Int, minutes: Int, currentMinute: Int, blueprint: Blueprint
    ): Int = {
        val (newOre, newClay, newObsidian, newGeode) = (
          ore + oreRobots, clay + clayRobots, obsidian + obsidianRobots, geode + geodeRobots
        )
        // println(s"====== Minute : ${currentMinute} =====")
        if (currentMinute == minutes) return newGeode
        if (obsidian >= blueprint.geode_robot_obsidian_costs && ore >= blueprint.geode_robot_ore_costs) {
            // println(s"Spend ${blueprint.geode_robot_obsidian_costs} obsidian and ${blueprint.geode_robot_ore_costs} ore to build a geode-robot")
            // println(s"Current resources: ${newOre - blueprint.geode_robot_ore_costs} ore, ${newClay} clay, ${newObsidian - blueprint.geode_robot_obsidian_costs}, obsidian, and ${newGeode} geode")
            return maximize_num_geodes(
                ore = newOre - blueprint.geode_robot_ore_costs, oreRobots = oreRobots,
                clay = newClay, clayRobots = clayRobots,
                obsidian = newObsidian - blueprint.geode_robot_obsidian_costs, obsidianRobots = obsidianRobots,
                geode = newGeode, geodeRobots = geodeRobots + 1,
                minutes = minutes, currentMinute = currentMinute + 1, blueprint = blueprint
            )
        }
        var (optionA, optionB, optionC, optionD) = (0, 0, 0, 0)
        if (clay >= blueprint.obsidian_robot_clay_costs && ore >= blueprint.obsidian_robot_ore_costs) {
            // println(s"Spend ${blueprint.obsidian_robot_clay_costs} clay and ${blueprint.obsidian_robot_ore_costs} ore to build an obsidian-robot")
            // println(s"Current resources: ${newOre - blueprint.obsidian_robot_ore_costs} ore, ${newClay - blueprint.obsidian_robot_clay_costs} clay, ${newObsidian}, obsidian, and ${newGeode} geode")
            optionA = maximize_num_geodes(
                ore = newOre - blueprint.obsidian_robot_ore_costs, oreRobots = oreRobots,
                clay = newClay - blueprint.obsidian_robot_clay_costs, clayRobots = clayRobots,
                obsidian = newObsidian, obsidianRobots = obsidianRobots + 1,
                geode = newGeode, geodeRobots = geodeRobots,
                minutes = minutes, currentMinute = currentMinute + 1, blueprint = blueprint
            )
        }
        if (ore >= blueprint.clay_robot_ore_costs && clayRobots <= blueprint.maxClay) {
            // println(s"Spend ${blueprint.clay_robot_ore_costs} ore to build a clay-robot")
            // println(s"Current resources: ${newOre - blueprint.clay_robot_ore_costs} ore, ${newClay} clay, ${newObsidian}, obsidian, and ${newGeode} geode")
            optionB = maximize_num_geodes(
                ore = newOre - blueprint.clay_robot_ore_costs, oreRobots = oreRobots,
                clay = newClay, clayRobots = clayRobots + 1,
                obsidian = newObsidian, obsidianRobots = obsidianRobots,
                geode = newGeode, geodeRobots = geodeRobots,
                minutes = minutes, currentMinute = currentMinute + 1, blueprint = blueprint
            )
        }
        if (ore >= blueprint.ore_robot_ore_costs && oreRobots <= blueprint.maxOre) {
            // println(s"Spend ${blueprint.ore_robot_ore_costs} ore to build an ore-robot")
            // println(s"Current resources: ${newOre - blueprint.ore_robot_ore_costs} ore, ${newClay} clay, ${newObsidian}, obsidian, and ${newGeode} geode")
            optionC = maximize_num_geodes(
                ore = newOre - blueprint.ore_robot_ore_costs, oreRobots = oreRobots + 1,
                clay = newClay, clayRobots = clayRobots,
                obsidian = newObsidian, obsidianRobots = obsidianRobots,
                geode = newGeode, geodeRobots = geodeRobots,
                minutes = minutes, currentMinute = currentMinute + 1, blueprint = blueprint
            )
        }
        if (ore < blueprint.maxOre) {
            // println(s"Don't spend any ore to save up for something better")
            // println(s"Current resources: ${newOre} ore, ${newClay} clay, ${newObsidian}, obsidian, and ${newGeode} geode")
            optionD = maximize_num_geodes(
                ore = newOre, oreRobots = oreRobots, clay = newClay, clayRobots = clayRobots,
                obsidian = newObsidian, obsidianRobots = obsidianRobots, geode = newGeode, geodeRobots = geodeRobots,
                minutes = minutes, currentMinute = currentMinute + 1, blueprint = blueprint
            )
        }
        return Array(optionA, optionB, optionC, optionD).max
    }

    val blueprints = parseInput("input.txt")
    val pt1Score = blueprints.map(bp => {
        val maxGeodes = maximize_num_geodes(0, 1, 0, 0, 0, 0, 0, 0, 24, 1, bp)
        val blueprintScore = bp.number * maxGeodes
        println(s"Part 1 -- Blueprint ${bp.number} score = ${blueprintScore}")
        blueprintScore
    }).sum
    println(s"Part 1 -- Total blueprint score = ${pt1Score}")

    val pt2Score = blueprints.take(3).map(bp => {
        val maxGeodes = maximize_num_geodes(0, 1, 0, 0, 0, 0, 0, 0, 32, 1, bp)
        println(s"Part 2 -- Blueprint ${bp.number} max geodes = ${maxGeodes}")
        maxGeodes
    }).product
    println(s"Part 2 -- Product of first three blueprint scores = ${pt2Score}")
}