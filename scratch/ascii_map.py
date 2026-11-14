import struct

with open('/Users/aditiyapratama/.gemini/antigravity/brain/864fd52c-6088-474d-bc7f-c4052cdedc2f/scratch/screenshot.bmp', 'rb') as f:
    header = f.read(54)
    width = struct.unpack('<I', header[18:22])[0]
    height = abs(struct.unpack('<i', header[22:26])[0])
    bpp = struct.unpack('<H', header[28:30])[0]
    row_size = ((width * bpp + 31) // 32) * 4
    
    def get_pixel(f, x, y):
        bmp_y = height - 1 - y
        f.seek(54 + bmp_y * row_size + x * (bpp // 8))
        b, g, r = struct.unpack('BBB', f.read(3))
        return r, g, b

    # Scan across row 280 (where "Aditiya Pratama" is) and row 140 (where navbar is)
    for test_y in [140, 200, 280, 500, 700]:
        print(f"\n--- Y = {test_y} ---")
        line = ""
        for x in range(30, width - 30, 8):
            r, g, b = get_pixel(f, x, test_y)
            # categorize color: '#' for bright/text, '.' for orange/brown bg, ' ' for dark/black
            brightness = (r + g + b) // 3
            if brightness > 120:
                char = '#'
            elif r > 25 and (r > g): # orange/brown tint
                char = ':'
            elif brightness > 30:
                char = '+'
            else:
                char = ' '
            line += char
        print(line)
