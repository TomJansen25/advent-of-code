import re

ALL_CARDS = []


def calc_value(n: int) -> int:
    """ "
    Quick function to generate a geometric progression
    :param n:
    :return:
    """
    if n == 0:
        return 0
    elif n == 1:
        return 1
    else:
        value = 1
        for i in range(1, n):
            value = value * 2
        return value


def get_value_per_card(input: str) -> dict[str, int]:
    card_values = dict()

    for line in input.splitlines():
        card, numbers = line.split(":")
        winning_numbers, owned_numbers = numbers.split(" | ")
        winning_numbers = set(
            [int(n) for n in winning_numbers.split(" ") if n.isdigit()]
        )
        owned_numbers = set([int(n) for n in owned_numbers.split(" ") if n.isdigit()])
        winning_numbers_on_card = len(owned_numbers.intersection(winning_numbers))
        card_values[card] = calc_value(winning_numbers_on_card)

    return card_values


def get_card_copies(input: str) -> dict[int, int]:
    card_copies: dict[int, int] = dict()
    cards_to_process = input.splitlines()

    for line in cards_to_process:
        card, numbers = line.split(":")
        winning_numbers, owned_numbers = numbers.split(" | ")
        winning_numbers = set(
            [int(n) for n in winning_numbers.split(" ") if n.isdigit()]
        )
        owned_numbers = set([int(n) for n in owned_numbers.split(" ") if n.isdigit()])
        winning_numbers_on_card = len(owned_numbers.intersection(winning_numbers))

        card_index = int(re.findall(r"\d+", card)[0])
        card_copies[card_index] = list(
            range(card_index + 1, card_index + 1 + winning_numbers_on_card)
        )

    return card_copies


def process_copies(copies: list):
    for copy in copies:
        ALL_CARDS.append(copy)
        process_copies(card_copies.get(copy))


if __name__ == "__main__":
    with open("input.txt", "r") as f:
        input = f.read()

    card_values = get_value_per_card(input)
    print(f"Solution to part 1: {sum(card_values.values())}")

    card_copies = get_card_copies(input)

    ALL_CARDS.extend(list(card_copies.keys()))

    for card, copies in card_copies.items():
        process_copies(copies)

    print(f"Solution to part 2: {len(ALL_CARDS)}")
