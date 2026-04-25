from PIL import Image
import os

buildings_dir = r'c:\Users\fotoa\Desktop\MW\guerras-modernas\public\assets\buildings'

files = [
    'housing_v1.png', 'hq_v2.png', 'mina_v1.png', 
    'muralha_v2.png', 'recrutamento_v1.png', 'refinaria_v1.png'
]

def super_clean_pil(filename):
    path = os.path.join(buildings_dir, filename)
    if not os.path.exists(path): return

    img = Image.open(path).convert("RGBA")
    datas = img.getdata()
    
    # Get the background color from top-left
    bg = datas[0]
    
    new_data = []
    for item in datas:
        r, g, b, a = item
        
        # Distance to background
        dist = ((r - bg[0])**2 + (g - bg[1])**2 + (b - bg[2])**2)**0.5
        
        # Grey-ness (range between max and min channel)
        # Backgrounds are perfectly grey (low range)
        diff = max(r, g, b) - min(r, g, b)
        
        # IF it's close to BG color OR (it's very grey AND light)
        if dist < 110 or (diff < 15 and r > 80):
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(path, "PNG", optimize=True)
    print(f"Super Cleaned {filename} - New size: {os.path.getsize(path)}")

for f in files:
    super_clean_pil(f)
