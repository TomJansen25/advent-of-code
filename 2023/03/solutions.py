import re
from typing import Tuple

import numpy as np
from pydantic import BaseModel

NUMBER = re.compile(r"\d+")
SYMBOLS = re.compile(r"[^\d\.]")


class Number(BaseModel):
    number: int
    x_start: int
    x_end: int
    y: int


class Symbol(BaseModel):
    symbol: str
    x: int
    y: int


def find_symbols_and_numbers(input: str) -> Tuple[list[Symbol], list[Number]]:
    symbols = []
    numbers = []

    for i, line in enumerate(input.splitlines()):
        numbers.extend(
            [
                Number(number=int(m.group()), x_start=m.start(), x_end=m.end() - 1, y=i)
                for m in NUMBER.finditer(line)
            ]
        )
        symbols.extend(
            [Symbol(symbol=m.group(), x=m.start(), y=i) for m in SYMBOLS.finditer(line)]
        )

    return symbols, numbers


def is_part_number(number: Number, symbols: list[Symbol]) -> bool:
    y_adjacent = [s for s in symbols if s.y <= number.y + 1 and s.y >= number.y - 1]
    x_adjacent = [
        s for s in y_adjacent if s.x >= number.x_start - 1 and s.x <= number.x_end + 1
    ]
    return True if len(x_adjacent) > 0 else False


def get_gear_ratio(symbol: Symbol, numbers: list[Number]) -> int:
    gear_ratio = 0

    y_adjacent = [
        number
        for number in numbers
        if number.y <= symbol.y + 1 and number.y >= symbol.y - 1
    ]
    x_adjacent = [
        number
        for number in y_adjacent
        if number.x_end >= symbol.x - 1 and number.x_start <= symbol.x + 1
    ]
    if len(x_adjacent) == 2:
        gear_ratio = np.prod([n.number for n in x_adjacent])

    return gear_ratio


if __name__ == "__main__":
    with open("input.txt", "r") as f:
        input = f.read()

    symbols, numbers = find_symbols_and_numbers(test_input)
    part_numbers = [
        number.number for number in numbers if is_part_number(number, symbols)
    ]
    print(f"Solution Part 1: {sum(part_numbers)}")

    potential_gears = [s for s in symbols if s.symbol == "*"]
    gear_ratios = []

    for symbol in potential_gears:
        gear_ratios.append(get_gear_ratio(symbol, numbers))

    print(f"Solution Part 2: {sum(gear_ratios)}")
