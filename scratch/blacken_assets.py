from PIL import Image
import os

buildings_dir = r'c:\Users\fotoa\Desktop\MW\guerras-modernas\public\assets\buildings'

files = [
    'housing_v1.png', 'hq_v2.png', 'mina_v1.png', 
    'muralha_v2.png', 'recrutamento_v1.png', 'refinaria_v1.png'
]

def make_bg_black(filename):
    path = os.path.join(buildings_dir, filename)
    if not os.path.exists(path): return

    img = Image.open(path).convert("RGB")
    width, height = img.size
    
    # Get corner color (background)
    bg = img.getpixel((0, 0))
    
    data = img.getdata()
    new_data = []
    for item in data:
        r, g, b = item
        # If it's close to the background color, make it PURE BLACK
        dist = ((r - bg[0])**2 + (g - bg[1])**2 + (b - bg[2])**2)**0.5
        if dist < 80:
            new_data.append((0, 0, 0))
        else:
            # Also darken greyish tones to help with the blend
            diff = max(r, g, b) - min(r, g, b)
            if diff < 20 and r > 100:
                 new_data.append((0, 0, 0))
            else:
                 new_data.append(item)

    img.putdata(new_data)
    img.save(path, "PNG", optimize=True)
    print(f"Blackened {filename}")

for f in files:
    make_bg_black(f)
