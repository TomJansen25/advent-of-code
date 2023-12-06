import numpy as np


def process_input(input: str, part_2: bool = False) -> list[tuple]:
    if part_2:
        times = [int(input.splitlines()[0].replace("Time:  ", "").replace(" ", ""))]
        distances = [
            int(input.splitlines()[1].replace("Distance:  ", "").replace(" ", ""))
        ]
    else:
        times = [int(t) for t in input.splitlines()[0].replace("Time:  ", "").split()]
        distances = [
            int(d) for d in input.splitlines()[1].replace("Distance:  ", "").split()
        ]
    races = list(zip(times, distances))
    return races


def find_record_beating_holds(races: list[tuple]) -> list[int]:
    win_counters = []

    for race in races:
        win_counter = 0
        ms, race_record = race
        for mm_per_ms in range(1, ms + 1):
            remaining_ms = ms - mm_per_ms
            distance = remaining_ms * mm_per_ms
            # print(f"Holding for {mm_per_ms} milliseconds gives a distance of {distance} millimeters")
            if distance > race_record:
                win_counter += 1

        win_counters.append(win_counter)

    return win_counters


if __name__ == "__main__":
    with open("input.txt", "r") as f:
        input = f.read()

    races_part_1 = process_input(input=input)
    record_beats_part_1 = find_record_beating_holds(races=races_part_1)
    print(f"Solution to part 1: {np.prod(record_beats_part_1)}")

    races_part_2 = process_input(input=input, part_2=True)
    record_beats_part_2 = find_record_beating_holds(races=races_part_2)
    print(f"Solution to part 2: {np.prod(record_beats_part_2)}")
