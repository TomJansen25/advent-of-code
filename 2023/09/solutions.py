def get_diffs(nums: list[int]) -> list[int]:
    diffs = []
    for i in range(len(nums) - 1):
        diffs.append(nums[i + 1] - nums[i])
    return diffs


def process_line(line: list[int], part_2: bool = False):
    line_breakdown = {"1": line}
    line_counter = 1

    zero_line_found = False
    line_to_process = line

    while not zero_line_found:
        line_counter += 1
        diffs = get_diffs(nums=line_to_process)
        line_breakdown[str(line_counter)] = diffs

        if all([d == 0 for d in diffs]):
            zero_line_found = True
        else:
            line_to_process = diffs

    reverse_keys = sorted(line_breakdown.keys(), key=lambda x: int(x), reverse=True)

    for key in reverse_keys[1:]:
        if part_2:
            num_to_add = line_breakdown.get(str(int(key) + 1))[0]
            new_first_num = line_breakdown.get(key)[0] - num_to_add
            new_nums = [new_first_num] + line_breakdown.get(key)
        else:
            num_to_add = line_breakdown.get(str(int(key) + 1))[-1]
            new_last_num = line_breakdown.get(key)[-1] + num_to_add
            new_nums = line_breakdown.get(key) + [new_last_num]
        line_breakdown[key] = new_nums

    return line_breakdown.get("1")[0] if part_2 else line_breakdown.get("1")[-1]


def get_new_historic_values(lines: list, part_2: bool = False) -> list[int]:
    new_values = []

    for line in lines:
        line = [int(n) for n in line.split()]
        new_value = process_line(line=line, part_2=part_2)
        new_values.append(new_value)
    return new_values


if __name__ == "__main__":
    with open("input.txt", "r") as f:
        input = f.read()

    lines = input.splitlines()
    new_values = get_new_historic_values(lines=lines)
    print(f"Solution of part 1: {sum(new_values)}")

    new_values = get_new_historic_values(lines=lines, part_2=True)
    print(f"Solution of part 2: {sum(new_values)}")
