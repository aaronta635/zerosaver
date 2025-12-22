import string
import random


def generate_random_id(length: int = 10, prefix="TKN"):
    characters = string.ascii_letters + string.digits
    tracking_number = prefix[0:3]
    for _ in range(length):
        tracking_number += "".join(random.choice(characters))

    return tracking_number


def generate_pickup_code(length: int = 5) -> str:
    """
    Generate a short, human-friendly pickup code (e.g., A27, D4F8Z).
    Uses upper-case letters and digits to keep it easy to read aloud.
    """
    characters = string.ascii_uppercase + string.digits
    return "".join(random.choice(characters) for _ in range(length))