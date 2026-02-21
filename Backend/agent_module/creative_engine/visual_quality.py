import numpy as np

MIN_BRIGHTNESS = 90


def compute_brightness(image):
    arr = np.array(image.convert("L"))
    return arr.mean()


def passes_quality_check(image):
    brightness = compute_brightness(image)

    if brightness < MIN_BRIGHTNESS:
        return False

    return True