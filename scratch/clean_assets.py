from PIL import Image
import os

buildings_dir = r'c:\Users\fotoa\Desktop\MW\guerras-modernas\public\assets\buildings'
output_dir = buildings_dir # Overwrite originals

files = [
    'mina_v1.png', 'recrutamento_v1.png', 'refinaria_v1.png', 'housing_v1.png',
    'hq_v2.png', 'muralha_v2.png', 'fabrica_v2.png', 'aerodromo_v1.png',
    'pesquisa_v1.png', 'radar_v1.png', 'energia_v1.png', 'quartel_v2.png'
]

def clean_image(filename):
    path = os.path.join(buildings_dir, filename)
    if not os.path.exists(path):
        print(f"Skipping {filename}: Not found")
        return

    img = Image.open(path).convert("RGBA")
    datas = img.getdata()

    # Get background color from top-left pixel
    bg_color = datas[0]
    
    # We want to remove colors close to the background
    # But some AI images have noise. We'll use a threshold.
    threshold = 50 

    new_data = []
    for item in datas:
        # Distance to background color
        dist = ((item[0] - bg_color[0])**2 + (item[1] - bg_color[1])**2 + (item[2] - bg_color[2])**2)**0.5
        
        if dist < threshold:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)
    
    # Save with optimization to keep file size small (like Quartel)
    img.save(path, "PNG", optimize=True)
    print(f"Cleaned {filename}")

for f in files:
    clean_image(f)
