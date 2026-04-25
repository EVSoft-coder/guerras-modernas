from PIL import Image, ImageDraw
import os

buildings_dir = r'c:\Users\fotoa\Desktop\MW\guerras-modernas\public\assets\buildings'

files = [
    'mina_v1.png', 'recrutamento_v1.png', 'refinaria_v1.png', 'housing_v1.png',
    'hq_v2.png', 'muralha_v2.png', 'fabrica_v2.png', 'aerodromo_v1.png',
    'pesquisa_v1.png', 'radar_v1.png', 'energia_v1.png'
]

def nuclear_clean(filename):
    path = os.path.join(buildings_dir, filename)
    if not os.path.exists(path): return

    img = Image.open(path).convert("RGBA")
    width, height = img.size
    
    # Flood fill from the four corners
    # This is much better for removing backgrounds that wrap around
    mask = Image.new('L', (width, height), 0)
    
    # We'll use a high tolerance flood fill
    # Pillow doesn't have a built-in tolerance flood fill for alpha, 
    # so we'll do a trick: convert to grey, find edges, then mask.
    
    # Simpler: Just remove everything that is "greyish" or "whiteish" 
    # but only if it's connected to the edges.
    
    data = img.getdata()
    new_data = []
    
    # Bounding box of the building (rough estimate)
    # Most buildings are centered.
    # Let's just remove pixels where R~=G~=B and (R > 180 or R < 100) 
    # This often catches grey backgrounds and checkered patterns.
    
    for item in data:
        r, g, b, a = item
        # If it's a grey tone (R, G, B are similar)
        is_grey = abs(r-g) < 20 and abs(g-b) < 20 and abs(r-b) < 20
        
        # Checkered patterns are usually light grey (200+) or mid grey (120-150)
        # We'll remove them if they are greyish.
        if is_grey and (r > 100): 
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(path, "PNG", optimize=True)
    print(f"Nuclear Cleaned {filename}")

for f in files:
    nuclear_clean(f)
