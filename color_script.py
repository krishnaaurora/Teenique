from PIL import Image
import numpy as np
from collections import Counter

def get_dominant_color(image_path):
    img = Image.open(image_path)
    img = img.convert('RGB')
    pixels = list(img.getdata())
    # Exclude light colors (background)
    filtered_pixels = [p for p in pixels if not (p[0] > 200 and p[1] > 200 and p[2] > 200)]
    if not filtered_pixels:
        return (0,0,0)  # default black
    counter = Counter(filtered_pixels)
    dominant_color = counter.most_common(1)[0][0]
    return dominant_color

# Check multiple images
images = [
    'products/PRODUCT CODE 00001T/Screenshot 2025-12-07 204932.png',
    'products/PRODUCT CODE 00001T/Screenshot 2025-12-07 204943.png',
    'products/PRODUCT CODE 00001T/Screenshot 2025-12-07 204819.png',
    'products/PRODUCT CODE 00001T/Screenshot 2025-12-07 204831.png'
]

for img_path in images:
    color = get_dominant_color(img_path)
    print(f'{img_path}: #{color[0]:02x}{color[1]:02x}{color[2]:02x}')