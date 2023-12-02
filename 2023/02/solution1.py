BAG_LIMITS = dict(red=12, green=13, blue=14)
COLORS = ("red", "green", "blue")


def map_bags_to_dict(bags: str) -> dict:
    bags = bags.split(", ")
    bag_dict = {}
    for bag in bags:
        for color in COLORS:
            if color in bag:
                bag_dict[color] = int(bag.replace(color, "").replace(" ", ""))
    return bag_dict


def is_bag_possible(bag: dict) -> bool:
    for color, cubes in bag.items():
        if cubes > BAG_LIMITS.get(color):
            return False
    return True


def find_possible_games(input: str) -> list[int]:
    possible_games = []

    for line in input.splitlines():
        game, game_subsets = line.split(":")
        subsets = game_subsets.split("; ")

        bags = [map_bags_to_dict(subset) for subset in subsets]
        values = [is_bag_possible(bag) for bag in bags]

        if all(values):
            possible_games.append(int(game.replace("Game ", "")))

    return possible_games


if __name__ == "__main__":
    with open("input.txt", "r") as f:
        input = f.read()

    possible_games = find_possible_games(input)
    print(sum(possible_games))
