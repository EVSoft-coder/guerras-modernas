from PIL import Image
import os
from collections import deque

buildings_dir = r'c:\Users\fotoa\Desktop\MW\guerras-modernas\public\assets\buildings'

files = [
    'housing_v1.png', 'hq_v2.png', 'mina_v1.png', 
    'muralha_v2.png', 'recrutamento_v1.png', 'refinaria_v1.png'
]

def magic_wand_pro(filename):
    path = os.path.join(buildings_dir, filename)
    if not os.path.exists(path): return

    img = Image.open(path).convert("RGBA")
    width, height = img.size
    pixels = img.load()
    
    # Start points (4 corners)
    seeds = [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]
    bg_color = pixels[0, 0]
    
    visited = set()
    to_visit = deque(seeds)
    
    # Higher tolerance for AI noise
    tolerance = 85 
    
    while to_visit:
        x, y = to_visit.popleft()
        if (x, y) in visited: continue
        visited.add((x, y))
        
        r, g, b, a = pixels[x, y]
        dist = ((r - bg_color[0])**2 + (g - bg_color[1])**2 + (b - bg_color[2])**2)**0.5
        
        if dist < tolerance:
            # Mark as transparent
            pixels[x, y] = (0, 0, 0, 0)
            
            # Check neighbors
            for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                    to_visit.append((nx, ny))

    # Resize to 512 for sharpness and size
    img.thumbnail((512, 512), Image.Resampling.LANCZOS)
    
    img.save(path, "PNG", optimize=True)
    print(f"Magic Wand Pro: Cleaned {filename}")

for f in files:
    magic_wand_pro(f)
