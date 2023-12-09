import math

from pydantic import BaseModel


class Node(BaseModel):
    node: str
    left: str
    right: str


def process_input(input: str) -> tuple[list, list[Node]]:
    lines = input.splitlines()
    instructions = lines[0]
    network = lines[2:]
    nodes = []
    for node in network:
        n, next = node.replace("(", "").replace(")", "").split(" = ")
        left, right = next.split(", ")
        nodes.append(Node(node=n, left=left, right=right))
    return instructions, nodes


def find_number_steps_part_1(
    nodes: list[Node], instructions: list[str], starting_node: Node
) -> int:
    current_node = starting_node
    next_node = starting_node

    num_instructions = 0

    for i, instruction in enumerate(instructions):
        if instruction == "L":
            next_node = [n for n in nodes if n.node == current_node.left][0]
        else:
            next_node = [n for n in nodes if n.node == current_node.right][0]

        if next_node.node == "ZZZ":
            num_instructions = i + 1
            break

        current_node = next_node

    return num_instructions


def find_number_steps_part_2(
    nodes: list[Node], instructions: list[str], starting_nodes: list[Node]
) -> list[int]:
    num_instructions = []

    for starting_node in starting_nodes:
        current_node = starting_node

        for i, instruction in enumerate(instructions):
            if instruction == "L":
                next_node = [n for n in nodes if n.node == current_node.left][0]
            else:
                next_node = [n for n in nodes if n.node == current_node.right][0]

            if next_node.node.endswith("Z"):
                num_instructions.append(i + 1)
                break

            current_node = next_node

    return num_instructions


if __name__ == "__main__":
    with open("input.txt", "r") as f:
        input = f.read()

    instructions, nodes = process_input(input)
    starting_node = [n for n in nodes if n.node == "AAA"][0]
    num_instructions = find_number_steps_part_1(
        nodes=nodes, instructions=list(instructions) * 100, starting_node=starting_node
    )
    print(f"Solution to Part 1: {num_instructions}")

    instructions, nodes = process_input(input=input)
    starting_nodes = [n for n in nodes if n.node.endswith("A")]

    num_instructions = find_number_steps_part_2(
        nodes=nodes,
        instructions=list(instructions) * 100,
        starting_nodes=starting_nodes,
    )
    print(f"Solution to Part 2: {math.lcm(*num_instructions)}")
