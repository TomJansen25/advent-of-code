import scala.io.Source

object DirectorySizes extends App {
    def parseInput(filename: String): Array[String] = {
        val lines = Source.fromFile(filename).getLines().mkString("\n").trim
        val commands = lines.split("\n")
        return commands
    }

    val cdRegex = """\$ cd ([\w]+)""".r
    val lsRegex = """\$ ls""".r
    val dirRegex = """dir (.+)""".r
    val fileRegex = """(\d+) (.+)""".r

    case class File(name: String, size: Int)

    case class Dir(name: String, parent: Option[Dir] = None) {
        var dirs: List[Dir] = List()
        var files: List[File] = List()

        def size: Long = files.map(_.size).sum
        // def recursiveSize: Long = this.size() +

        def addFile(file: File): Unit = files = files ::: List(file)

        def addDir(dir: Dir): Unit = dirs = dirs ::: List(dir)

        def getDir(name: String): Option[Dir] = {
            val matches = dirs.filter(x => x.name == name)
            return if (matches.isEmpty) None else Some(matches(0))
        }
    }

    def changeDir(cwd: Dir, newDirName: String): Dir = {

        var newCwd = cwd

        cwd.getDir(newDirName) match {
            case Some(dir) => newCwd = dir
            case None => {
                val newDir = Dir(newDirName, Some(cwd))
                cwd.addDir(newDir)
                newCwd = newDir
            }
        }
        return newCwd
    }

    def parseTerminal(input: Array[String]): Dir = {
        val root = Dir("/")
        var cwd = root

        input.foreach(i => {
            println(i)
            i match {
                case "$ cd /" => cwd = root
                case "$ cd .." => cwd = cwd.parent.getOrElse(root)
                case cdRegex(dir) => cwd = changeDir(cwd, dir)
                case "$ ls" => println(s"List children of current directory: ${cwd.name}")
                case dirRegex(name) => {
                    println(s"Adding dir ${name} to ${cwd.name}")
                    cwd.addDir(Dir(name, Some(cwd)))
                }
                case fileRegex(size, file) => {
                    println(s"Adding file ${file} to ${cwd.name}")
                    cwd.addFile(File(file, size.toInt))
                }
                case _ => println("Command couldn't be parsed")
            }
        })
        return root
    }

    var root = Dir("/")
    var cwd = root

    val root = parseTerminal(input)
    val sum = root.dirs.foldLeft(0)(println(s"${dir.name}"))


}