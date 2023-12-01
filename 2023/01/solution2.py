import re
from collections import OrderedDict

SPELLED_DIGITS = (
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
)
INTEGER_DIGITS = range(1, 10)
DIGIT_MAP = dict(zip(SPELLED_DIGITS, INTEGER_DIGITS))

REGEX = re.compile(r"(?=(" + "|".join(SPELLED_DIGITS) + r"))")


def get_real_calibration_value(line: str) -> int:
    pure_digits = dict((m.start(), m.group()) for m in re.finditer(r"[0-9]", line))

    written_digits = dict(
        (m.start(1), str(DIGIT_MAP.get(m.group(1)))) for m in REGEX.finditer(line)
    )

    combined_digits = pure_digits | written_digits
    combined_digits = OrderedDict(sorted(combined_digits.items()))
    digits = list(combined_digits.values())

    real_calibration_value = (
        int(digits[0] + digits[-1]) if len(digits) > 1 else int(digits[0] + digits[0])
    )
    return real_calibration_value


if __name__ == "__main__":
    with open("input.txt", "r") as f:
        input = f.read()

    real_calibration_values = []

    for line in input.split("\n")[:-1]:
        real_calibration_values.append(get_real_calibration_value(line))

    print(sum(real_calibration_values))
