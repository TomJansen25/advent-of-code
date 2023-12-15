from pydantic import BaseModel

TEST_INPUT = """O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#...."""


class Rock(BaseModel):
    x: int
    y: int
    fix: bool = False
    load: int = None

    def tilt_vertical(self, rocks: list, max_y: int, direction: str = "north"):
        can_tilt = True

        if direction == "north":
            mult = -1
            max_y = 0
        elif direction == "south":
            mult = 1
        else:
            raise ValueError("Only vertical directions north and south possible")

        while can_tilt and self.y != max_y:
            obstacles = [
                rock
                for rock in rocks
                if rock.x == self.x and rock.y == self.y + (1 * mult)
            ]
            if len(obstacles) < 1:
                self.y += 1 * mult
            else:
                can_tilt = False

    def tilt_horizontal(self, rocks: list, max_x: int, direction: str = "east"):
        can_tilt = True

        if direction == "east":
            mult = 1
        elif direction == "west":
            mult = -1
            max_x = 0
        else:
            raise ValueError("Only horizontal directions east and west possible")

        while can_tilt and self.x != max_x:
            obstacles = [
                rock
                for rock in rocks
                if rock.y == self.y and rock.x == self.x + (1 * mult)
            ]
            if len(obstacles) < 1:
                self.x += 1 * mult
            else:
                can_tilt = False

    def calc_load(self, num_lines: int):
        self.load = num_lines - self.y


def input_to_rocks(input: str) -> tuple[list[Rock], int, int]:
    rocks = list()
    lines = input.splitlines()

    for y, line in enumerate(lines):
        for x, space in enumerate(list(line)):
            if space != ".":
                rocks.append(Rock(x=x, y=y, fix=True if space == "#" else False))

    return rocks, len(lines), len(lines[0])


def tilt_rocks_north(rocks: list[Rock], num_lines: int) -> list[Rock]:
    for rock in rocks:
        if rock.fix == False:
            rock.tilt_vertical(rocks=rocks, max_y=0, direction="north")
            rock.calc_load(num_lines=num_lines)
    return rocks


def visualize_rocks(rocks: list[Rock], num_lines: int, num_spaces: int):
    field = ["." * num_spaces] * num_lines

    for rock in rocks:
        icon = "#" if rock.fix == True else "O"
        field[rock.y] = field[rock.y][: rock.x] + icon + field[rock.y][rock.x + 1 :]

    print("\n".join([line for line in field]))
    print("")


def spin_cycle_rocks(
    rocks: list[Rock], num_lines: int, num_spaces: int, num_cycles: int
) -> list[Rock]:
    max_xy = dict(north=0, west=0, south=num_lines - 1, east=num_spaces - 1)

    for cycle in range(num_cycles):
        for direction in ["north", "west", "south", "east"]:
            if direction in ("north", "south"):
                rocks = sorted(
                    rocks, key=lambda rock: rock.y, reverse=True if "south" else False
                )
            if direction in ("west", "east"):
                rocks = sorted(
                    rocks, key=lambda rock: rock.x, reverse=True if "east" else False
                )

            for rock in rocks:
                if rock.fix == False:
                    if direction in ("north", "south"):
                        rock.tilt_vertical(
                            rocks=rocks,
                            max_y=max_xy.get(direction),
                            direction=direction,
                        )
                    if direction in ("west", "east"):
                        rock.tilt_horizontal(
                            rocks=rocks,
                            max_x=max_xy.get(direction),
                            direction=direction,
                        )

            visualize_rocks(rocks, num_lines=num_lines, num_spaces=num_spaces)

    for rock in rocks:
        rock.calc_load(num_lines=num_lines)

    return rocks


if __name__ == "__main__":
    with open("input.txt", "r") as f:
        input = f.read()

    rocks, num_lines, num_spaces = input_to_rocks(input=input)
    rocks = tilt_rocks_north(rocks=rocks, num_lines=num_lines)
    visualize_rocks(rocks=rocks, num_lines=num_lines, num_spaces=num_spaces)
    print(f"Solution to part 1: {sum([r.load for r in rocks if r.fix == False])}")

    rocks, num_lines, num_spaces = input_to_rocks(input=TEST_INPUT)
    rocks = spin_cycle_rocks(
        rocks=rocks, num_lines=num_lines, num_spaces=num_spaces, num_cycles=1
    )
