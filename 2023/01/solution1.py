def get_calibration_value(line: str) -> int:
    digits = [d for d in line if d.isdigit()]

    if len(digits) > 1:
        return int(digits[0] + digits[-1])
    else:
        return int(digits[0] + digits[0])


if __name__ == "__main__":
    with open("input.txt", "r") as f:
        input = f.read()

    calibration_values = [
        get_calibration_value(line) for line in input.split("\n")[:-1]
    ]
    print(sum(calibration_values))
