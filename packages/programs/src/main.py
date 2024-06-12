from nada_dsl import *


DESCRIPTOR_SIZE = 128
THRESHOLD = 550


def sqrt(num: SecretInteger):
    guess = num
    for _ in range(12):
        guess = (guess + num / guess) / Integer(2)
    return guess


def get_euclidean_distance(actual: list[list[SecretInteger]], given: list[SecretInteger]) -> Integer:
    distances: list[Integer] = []
    for encoding in actual:
        distance = Integer(0)
        for i in range(DESCRIPTOR_SIZE):
            diff = encoding[i] - given[i]
            squared_diff = diff * diff
            distance += squared_diff
        distances.append(sqrt(distance))
    return distances[0]


def nada_main():
    party1 = Party(name="Party1")
    party2 = Party(name="Party2")

    actual: list[SecretInteger] = []
    given: list[SecretInteger] = []

    for i in range(DESCRIPTOR_SIZE):
        actual.append(SecretInteger(Input(name=f"actual-{i}", party=party1)))

    for i in range(DESCRIPTOR_SIZE):
        given.append(SecretInteger(Input(name=f"given-{i}", party=party2)))

    distance: Integer = get_euclidean_distance([actual], given)
    match = (distance < Integer(THRESHOLD)).if_else(Integer(1), Integer(0))

    return [
        Output(distance, "euclidean_distance", party1),
        Output(match, "match", party1)
    ]
