from PIL import Image, ImageDraw
import os

buildings_dir = r'c:\Users\fotoa\Desktop\MW\guerras-modernas\public\assets\buildings'

files = [
    'housing_v1.png', 'hq_v2.png', 'mina_v1.png', 
    'muralha_v2.png', 'recrutamento_v1.png', 'refinaria_v1.png'
]

def magic_wand_clean(filename):
    path = os.path.join(buildings_dir, filename)
    if not os.path.exists(path): return

    img = Image.open(path).convert("RGBA")
    
    # AI backgrounds often have noise, so we convert to a simplified color space first
    # to find the "connected" background.
    # But Pillow's floodfill is quite strict.
    
    # Better: Start at corners and remove connected pixels that are "close enough" to the corner color.
    bg_color = img.getpixel((0, 0))
    
    # We will use a mask and the seed points (corners)
    width, height = img.size
    
    # Create a white mask
    mask = Image.new('L', (width, height), 255)
    
    # Flood fill the mask from corners with black (0)
    # This identifies the "background" area
    # We use a trick: floodfill on a temporary image with tolerance
    temp = img.convert("RGB")
    
    # Floodfill from 4 corners
    seeds = [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]
    for seed in seeds:
        # Pillow floodfill doesn't have tolerance built-in, but we can use a loop or 
        # a more advanced method. 
        # Actually, let's use a very simple approach: 
        # If it's a "grey box" background, it's very consistent.
        ImageDraw.floodfill(img, seed, (0, 0, 0, 0), thresh=40)

    # Save as optimized PNG
    img.save(path, "PNG", optimize=True)
    print(f"Magic Wand Cleaned {filename} - Size: {os.path.getsize(path)}")

for f in files:
    magic_wand_clean(f)
