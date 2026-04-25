from PIL import Image
import os

buildings_dir = r'c:\Users\fotoa\Desktop\MW\guerras-modernas\public\assets\buildings'

files = [
    'housing_v1.png', 'hq_v2.png', 'mina_v1.png', 
    'muralha_v2.png', 'recrutamento_v1.png', 'refinaria_v1.png'
]

def final_polish(filename):
    path = os.path.join(buildings_dir, filename)
    if not os.path.exists(path): return

    img = Image.open(path).convert("RGBA")
    
    # Resize to 512 max dimension to match game scale and optimize
    # This significantly reduces file size and artifacts
    img.thumbnail((512, 512), Image.Resampling.LANCZOS)
    
    # Final pass to ensure transparency is CLEAN
    datas = img.getdata()
    new_data = []
    for item in datas:
        r, g, b, a = item
        # If it's semi-transparent grey, make it fully transparent
        if a < 50 or (max(r,g,b) - min(r,g,b) < 10 and r > 150):
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(path, "PNG", optimize=True)
    print(f"Polished {filename} - Final size: {os.path.getsize(path)}")

for f in files:
    final_polish(f)
