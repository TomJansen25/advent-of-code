from collections import defaultdict

import numpy as np
from solution1 import map_bags_to_dict


def merge_dicts_with_max_value(dicts: list[dict]) -> dict:
    merged_dict = defaultdict(list)
    for bag in dicts:
        for k, v in bag.items():
            merged_dict[k].append(v)

    final_dict = dict()
    for k, v in merged_dict.items():
        final_dict[k] = max(v)

    return final_dict


def find_mimimum_bags(input: str) -> list[int]:
    bag_products = []

    for line in input.splitlines():
        _, game_subsets = line.split(":")
        subsets = game_subsets.split("; ")

        bags = [map_bags_to_dict(subset) for subset in subsets]
        max_values = merge_dicts_with_max_value(dicts=bags)

        res = np.prod(list(max_values.values()))

        bag_products.append(res)

    return bag_products


if __name__ == "__main__":
    with open("input.txt", "r") as f:
        input = f.read()

    minimum_bags = find_mimimum_bags(input)
    print(sum(minimum_bags))
