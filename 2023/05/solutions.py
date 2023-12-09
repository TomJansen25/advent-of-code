from pydantic import BaseModel


class MapConfigs(BaseModel):
    name: str
    source: str
    destination: str
    destination_range_start: int
    source_range_start: int
    range_length: int


class Map(BaseModel):
    start: int
    end: int
    diff: int


class Mapping(BaseModel):
    name: str
    source: str
    destination: str
    maps: list[Map]


def process_input(input: str, part_2: bool = False) -> tuple[list, list]:
    lines = input.split("\n\n")
    seeds = [int(s) for s in lines[0].replace("seeds: ", "").split()]

    if part_2:
        seeds = [
            range(seed, seed + range_length)
            for seed, range_length in tuple(zip(seeds[0::2], seeds[1::2]))
        ]

    all_maps = list()

    for line in lines[1:]:
        ll = line.splitlines()
        name = ll[0].replace(" map:", "")
        source, destination = name.split("-to-")
        maps = ll[1:]
        for map in maps:
            drs, srs, rl = [int(d) for d in map.split()]
            all_maps.append(
                MapConfigs(
                    name=name,
                    source=source,
                    destination=destination,
                    destination_range_start=drs,
                    source_range_start=srs,
                    range_length=rl,
                )
            )

    return seeds, all_maps


def consolidate_maps(map_configs: list[MapConfigs]) -> list[Mapping]:
    mappings = {}

    for map_conf in map_configs:
        new_map = Map(
            start=map_conf.source_range_start,
            end=map_conf.source_range_start + map_conf.range_length - 1,
            diff=map_conf.destination_range_start - map_conf.source_range_start,
        )
        if map_conf.name in mappings:
            updated_mapping = Mapping(
                name=map_conf.name,
                source=map_conf.source,
                destination=map_conf.destination,
                maps=mappings.get(map_conf.name).maps + [new_map],
            )
            mappings[map_conf.name] = updated_mapping
        else:
            mappings[map_conf.name] = Mapping(
                name=map_conf.name,
                source=map_conf.source,
                destination=map_conf.destination,
                maps=[new_map],
            )

    return mappings


def get_final_locations(seeds: list[int], mappings: list[Mapping]) -> list[int]:
    final_locations = []

    for seed in seeds:
        current_location = seed
        next_location = seed

        for category_map in mappings.values():
            for map in category_map.maps:
                if current_location >= map.start and current_location <= map.end:
                    next_location = current_location + map.diff

            if category_map.destination == "location":
                final_locations.append(next_location)

            current_location = next_location

    return final_locations


if __name__ == "__main__":
    with open("input.txt", "r") as f:
        input = f.read()

    seeds, map_configs = process_input(input=input)
    mappings = consolidate_maps(map_configs)
    final_locations = get_final_locations(seeds, mappings)
    print(f"Solution to part 1: {min(final_locations)}")

    seeds, map_configs = process_input(input, part_2=True)

    for seed_range in seeds[2:]:
        mappings = consolidate_maps(map_configs)
        final_locations = get_final_locations(list(seed_range), mappings)
        print(f"Solution to part 2: {min(final_locations)}")
