from collections import Counter
from functools import cmp_to_key

from pydantic import BaseModel

CARD_STRENGTHS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"]
HAND_STRENGTHS = [
    "High card",
    "One pair",
    "Two pair",
    "Three of a kind",
    "Full house",
    "Four of a kind",
    "Five of a kind",
]

CARD_STRENGTHS_MAP = {
    "A": 14,
    "K": 13,
    "Q": 12,
    "J": 11,
    "T": 10,
}


class Hand(BaseModel):
    hand: str
    bid: int
    hand_strength: list[int] = None
    type: str = None
    rank: int = None
    final_score: int = None

    def get_hand_strength(self):
        self.hand_strength = [
            int(CARD_STRENGTHS_MAP.get(c, c)) for c in list(self.hand)
        ]

    def get_type(self):
        counts = Counter(self.hand)
        counts_values = counts.values()
        if len(counts_values) == 1 and 5 in counts_values:
            type = "Five of a kind"
        elif 4 in counts_values:
            type = "Four of a kind"
        elif len(counts_values) == 2 and 3 in counts_values and 2 in counts_values:
            type = "Full house"
        elif 3 in counts_values:
            type = "Three of a kind"
        elif Counter(counts_values).get(2) == 2:
            type = "Two pair"
        elif 2 in counts_values:
            type = "One pair"
        else:
            type = "High card"
        self.type = type

    def get_rank(self, max_rank: int = None):
        rank = HAND_STRENGTHS.index(self.type)
        if max_rank and rank == 6:
            rank = max_rank
        self.rank = rank

    def calc_score(self):
        self.final_score = self.bid * self.rank


def get_hands_from_input(input: str) -> list[Hand]:
    hands = []

    for hand_bid in input.splitlines():
        hand, bid = hand_bid.split()
        hand = Hand(hand=hand, bid=bid)
        hand.get_type()
        hand.get_hand_strength()
        hand.get_rank()
        hands.append(hand)

    return hands


def sort_hands(hand1: Hand, hand2: Hand) -> int:
    if hand1.rank > hand2.rank:
        return 1
    elif hand1.rank < hand2.rank:
        return -1
    else:
        for i in range(len(hand1.hand_strength)):
            if hand1.hand_strength[i] > hand2.hand_strength[i]:
                return 1
            elif hand1.hand_strength[i] < hand2.hand_strength[i]:
                return -1
            else:
                continue


if __name__ == "__main__":
    with open("input.txt", "r") as f:
        input = f.read()

    hands = get_hands_from_input(input=input)
    hands_sorted = sorted(hands, key=cmp_to_key(sort_hands))
    for i, hand in enumerate(hands_sorted, start=1):
        hand.rank = i
        hand.calc_score()
    print(f"Solution to part 1: {sum([h.final_score for h in hands_sorted])}")
