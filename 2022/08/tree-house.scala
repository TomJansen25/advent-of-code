import scala.io.Source
import scala.collection.mutable.Map

object TreeHouse extends App {

    case class Tree(height: Int, x: Int, y: Int) {
        var visible: Boolean = false
        var treesInView: Map[String, Int] = Map("U" -> 0, "D" -> 0, "L" -> 0, "R" -> 0)
        def scenicScore: Int = treesInView.values.reduce((acc: Int, item: Int) => acc * item)
    }

    def parseInput(filename: String): Array[Tree] = {
        val lines = Source.fromFile(filename).getLines().mkString("\n").trim
        val treeRows = lines.split("\n")
        val trees: Array[Tree] = treeRows.zipWithIndex.map { case (row, idy) =>
            row.split("").zipWithIndex.map { case (column, idx) =>
                Tree(column.toInt, idx, idy)
            }
        }.flatten
        return trees
    }

    def getMaxColHeightUp(x: Int, y: Int) = trees.filter(tree => (tree.x == x && tree.y < y)).map(_.height).max
    def getMaxColHeightDown(x: Int, y: Int) = trees.filter(tree => (tree.x == x && tree.y > y)).map(_.height).max
    def getMaxRowHeightLeft(x: Int, y: Int) = trees.filter(tree => (tree.y == y && tree.x < x)).map(_.height).max
    def getMaxRowHeightRight(x: Int, y: Int) = trees.filter(tree => (tree.y == y && tree.x > x)).map(_.height).max

    def isTreeVisible(tree: Tree): Boolean = {
        val colHeightUp = getMaxColHeightUp(tree.x, tree.y)
        val colHeightDown = getMaxColHeightDown(tree.x, tree.y)
        val colHeightLeft = getMaxRowHeightLeft(tree.x, tree.y)
        val colHeightRight = getMaxRowHeightRight(tree.x, tree.y)
        val allDirections = List(tree.height, colHeightUp, colHeightDown, colHeightLeft, colHeightRight)
        return if (tree.height > allDirections.min) true else false
    }

    def checkTreeHeight(tree: Tree, x: Int, y: Int): Tuple2[Int, Boolean] = {
        val height = trees.filter(t => (t.y == y && t.x == x))(0).height
        var visible = 0
        var equalHeightReached = false

        if (height >= tree.height) {
            visible = 1
            equalHeightReached = true
        } else visible = 1
        return (visible, equalHeightReached)
    }

    def treesVisibleColumn(tree: Tree, direction: String): Int = {
        var numTreesVisible: Int = 0
        var equalHeightReached: Boolean = false
        var y = tree.y - 1

        if (direction == "U") {
            while (y >= 0 && !equalHeightReached) {
                val (visible, stop) = checkTreeHeight(tree, tree.x, y)
                numTreesVisible += visible
                equalHeightReached = stop
                y = y - 1
            }
        } else if (direction == "D") {
            y = tree.y + 1
            while (y <= yMax && !equalHeightReached) {
                val (visible, stop) = checkTreeHeight(tree, tree.x, y)
                numTreesVisible += visible
                equalHeightReached = stop
                y = y + 1
            }
        }
        return numTreesVisible
    }

    def treesVisibleRow(tree: Tree, direction: String): Int = {
        var numTreesVisible: Int = 0
        var equalHeightReached: Boolean = false
        var x = tree.x - 1

        if (direction == "L") {
            while (x >= 0 && !equalHeightReached) {
                val (visible, stop) = checkTreeHeight(tree, x, tree.y)
                numTreesVisible += visible
                equalHeightReached = stop
                x = x - 1
            }
        } else if (direction == "R") {
            x = tree.x + 1
            while (x <= xMax && !equalHeightReached) {
                val (visible, stop) = checkTreeHeight(tree, x, tree.y)
                numTreesVisible += visible
                equalHeightReached = stop
                x = x + 1
            }
        }
        return numTreesVisible
    }

    val trees = parseInput("input.txt")
    val xMax = trees.map(_.x).max
    val yMax = trees.map(_.y).max

    trees.foreach(tree => {
        if (tree.x == 0 || tree.x == xMax) tree.visible = true
        else if (tree.y == 0 || tree.y == yMax) tree.visible = true
        else {
            tree.visible = isTreeVisible(tree)
            tree.treesInView += (
              "U" -> treesVisibleColumn(tree, "U"),
              "D" -> treesVisibleColumn(tree, "D"),
              "L" -> treesVisibleRow(tree, "L"),
              "R" -> treesVisibleRow(tree, "R")
            )
        }
    })
    println(s"Part 1 - number of trees visible: ${trees.filter(tree => tree.visible == true).length}")
    println(s"Part 2 - highest Scenic Score found: ${trees.map(_.scenicScore).max}")
}