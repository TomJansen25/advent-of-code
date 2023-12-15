from itertools import combinations

from pydantic import BaseModel


class Space(BaseModel):
    x: int
    y: int


class Galaxy(BaseModel):
    x: int
    y: int
    number: int = None


class Distance(BaseModel):
    galaxy_1: Galaxy
    galaxy_2: Galaxy
    distance: int


def input_to_expanded_field(input: str) -> list[Space]:
    field = input.splitlines()
    expanded_field = field.copy()
    expanded_x = []
    expanded_y = []

    for x in reversed(range(len(field[0]))):
        spaces = [f[x] for f in field]
        if all([x == "." for x in spaces]):
            expanded_x.append(x)
            new_expanded_field = []
            for line in expanded_field:
                new_line = line[:x] + "." + line[x:]
                new_expanded_field.append(new_line)
            expanded_field = new_expanded_field

    new_len = len(expanded_field)
    for y in reversed(range(new_len)):
        x_spaces = list(expanded_field[y])
        if all([x == "." for x in x_spaces]):
            expanded_y.append(y)
            expanded_field.insert(y, "." * len(x_spaces))

    spaces = []
    galaxies = []
    galaxy_num = 1
    for y, line in enumerate(expanded_field):
        for x, space in enumerate(list(line)):
            if space == ".":
                spaces.append(Space(x=x, y=y))
            else:
                galaxies.append(Galaxy(x=x, y=y, number=galaxy_num))
                galaxy_num += 1

    return expanded_field, expanded_x, expanded_y, spaces, galaxies


def get_sum_shortest_paths(
    galaxies: list[Galaxy],
    expanded_x: list[int],
    expanded_y: list[int],
    part_2: bool = False,
) -> int:
    diffs = []
    for galaxy_a, galaxy_b in list(combinations(galaxies, 2)):
        max_x, min_x = max(galaxy_a.x, galaxy_b.x), min(galaxy_a.x, galaxy_b.x)
        max_y, min_y = max(galaxy_a.y, galaxy_b.y), min(galaxy_a.y, galaxy_b.y)

        diff_x = max_x - min_x
        diff_y = max_y - min_y

        if part_2:
            for x in expanded_x:
                if x > min_x and x < max_x:
                    diff_x += 99
            for y in expanded_y:
                if y > min_y and y < max_y:
                    diff_y += 99

        diffs.append(diff_x + diff_y)

    return sum(diffs)


if __name__ == "__main__":
    with open("input.txt", "r") as f:
        input = f.read()

    field, expanded_x, expanded_y, spaces, galaxies = input_to_expanded_field(
        input=input
    )
    print(
        f"Solution to part 1: {get_sum_shortest_paths(galaxies, expanded_x, expanded_y)}"
    )
