from PIL import Image
import os

buildings_dir = r'c:\Users\fotoa\Desktop\MW\guerras-modernas\public\assets\buildings'

files = [
    'housing_v1.png', 'hq_v2.png', 'mina_v1.png', 
    'muralha_v2.png', 'recrutamento_v1.png', 'refinaria_v1.png'
]

def saturation_clean(filename):
    path = os.path.join(buildings_dir, filename)
    if not os.path.exists(path): return

    img = Image.open(path).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        r, g, b, a = item
        
        # Saturation: difference between highest and lowest color channel
        # Background is neutral grey (R~=G~=B), so diff is low.
        # Building has colors (cyan lights), so diff is higher.
        sat = max(r, g, b) - min(r, g, b)
        
        # Brightness
        bright = (r + g + b) / 3
        
        # If it's very grey (sat < 15) and not very dark
        if sat < 18 and bright > 50:
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)
    
    # Resize to 512 for sharpness and size optimization
    img.thumbnail((512, 512), Image.Resampling.LANCZOS)
    
    img.save(path, "PNG", optimize=True)
    print(f"Saturation Cleaned {filename} - Size: {os.path.getsize(path)}")

for f in files:
    saturation_clean(f)
