"""Render original, deterministic material illustrations; no external assets.
Requires Pillow. Production builds serve the checked-in WebP files directly.
"""
from pathlib import Path
import math
import random
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public/prototypes/objects"
MASTER = ROOT / "assets/prototypes/objects"
OUT.mkdir(parents=True, exist_ok=True)
MASTER.mkdir(parents=True, exist_ok=True)
random.seed(31)
SIZE = (640, 400)

def canvas():
    return Image.new("RGBA", SIZE, (0, 0, 0, 0))

def textured_polygon(image, points, color, grain=7):
    mask = Image.new("L", SIZE)
    ImageDraw.Draw(mask).polygon(points, fill=255)
    texture = canvas()
    px = texture.load()
    for y in range(SIZE[1]):
        for x in range(SIZE[0]):
            noise = random.uniform(-grain, grain)
            light = 13 * (1 - x / SIZE[0]) - 18 * y / SIZE[1]
            px[x, y] = tuple(max(0, min(255, int(c + noise + light))) for c in color) + (255,)
    image.alpha_composite(Image.composite(texture, canvas(), mask))

def shadow(image, box):
    layer = canvas()
    ImageDraw.Draw(layer).ellipse(box, fill=(8, 28, 44, 62))
    return Image.alpha_composite(layer.filter(ImageFilter.GaussianBlur(13)), image)

def finish(image, name):
    image.save(MASTER / (name + ".png"))
    image.thumbnail((480, 300), Image.Resampling.LANCZOS)
    image.save(OUT / (name + ".webp"), "WEBP", quality=90, method=6)
    print(name, (OUT / (name + ".webp")).stat().st_size, "bytes")

# GPU: extruded aluminium shroud, brushed top plate, dual machined fan hubs.
gpu = canvas()
textured_polygon(gpu, [(88,185),(405,103),(536,167),(217,254)], (23,43,54), 5)
textured_polygon(gpu, [(88,156),(405,75),(536,139),(217,226)], (72,89,104), 5)
textured_polygon(gpu, [(88,156),(217,226),(217,254),(88,185)], (39,56,69), 4)
textured_polygon(gpu, [(217,226),(536,139),(536,167),(217,254)], (29,45,56), 4)
d = ImageDraw.Draw(gpu)
for i in range(19):
    y=148+i*3
    d.line([(237,y+50),(482,y-14)], fill=(139,157,169,80), width=1)
for cx,cy in [(231,160),(401,115)]:
    d.ellipse((cx-68,cy-35,cx+68,cy+35), fill=(12,24,34), outline=(140,156,170), width=3)
    for i in range(11):
        a=2*math.pi*i/11
        pts=[(cx+math.cos(a)*15,cy+math.sin(a)*8),
             (cx+math.cos(a+.25)*58,cy+math.sin(a+.25)*29),
             (cx+math.cos(a+.65)*49,cy+math.sin(a+.65)*25)]
        d.polygon(pts,fill=(53+3*i,68+2*i,81+2*i))
    d.ellipse((cx-16,cy-9,cx+16,cy+9), fill=(109,124,134), outline=(197,207,214), width=2)
for i in range(14):
    x=226+i*10
    y=243-(x-226)*.27
    d.polygon([(x,y),(x+7,y-2),(x+7,y+7),(x,y+9)], fill=(185,153,87))
for x,y in [(101,156),(404,86),(524,140),(220,216)]:
    d.ellipse((x-3,y-2,x+3,y+2),fill=(203,211,216))
finish(shadow(gpu,(105,216,536,285)), "gpu")

# DIMM: matte teal PCB, metallic memory packages and gold contact pads.
ram = canvas()
textured_polygon(ram,[(95,190),(496,102),(525,133),(123,226)],(24,68,68),6)
textured_polygon(ram,[(123,226),(525,133),(525,141),(123,235)],(10,35,39),4)
d=ImageDraw.Draw(ram)
for i in range(7):
    x=143+i*46; y=178-i*10
    textured_polygon(ram,[(x,y),(x+35,y-8),(x+52,y+13),(x+17,y+21)],(38,45,55),4)
    d=ImageDraw.Draw(ram)
    d.line([(x+4,y),(x+34,y-7)],fill=(137,151,157),width=1)
for i in range(36):
    x=133+i*10;y=222-(x-133)*.229
    d.polygon([(x,y-10),(x+6,y-11),(x+6,y),(x,y+1)],fill=(210,177,101))
for i in range(20):
    x=112+i*19;y=186-(x-112)*.22
    d.line([(x,y),(x+9,y-3),(x+15,y+4)],fill=(99,147,134),width=1)
finish(shadow(ram,(94,208,552,264)),"memory")

# Tennis: sphere lighting, mottled felt fibres and curved stitched seams.
ball=canvas()
pixels=ball.load()
cx,cy,r=320,183,105
for y in range(cy-r-2,cy+r+3):
    for x in range(cx-r-2,cx+r+3):
        u,v=(x-cx)/r,(y-cy)/r
        q=u*u+v*v
        if q<=1:
            z=math.sqrt(1-q)
            light=max(0, min(1,.3+(-u*.36-v*.5+z*.75)*.64))
            noise=random.uniform(-13,13)
            base=(142+73*light,160+67*light,40+40*light)
            pixels[x,y]=tuple(max(0,min(255,int(c+noise))) for c in base)+(255,)
d=ImageDraw.Draw(ball)
for i in range(6500):
    x=random.randint(cx-r,cx+r);y=random.randint(cy-r,cy+r)
    if (x-cx)**2+(y-cy)**2<r*r*.98:
        d.line([(x,y),(x+random.choice([-1,0,1]),y+2)],fill=random.choice([(212,226,110,120),(112,139,41,120),(239,242,171,120)]),width=1)
points=[]
for i in range(141):
    t=-1+2*i/140
    x=cx+math.sin(t*2.25)*r*.77
    y=cy+t*r*.96
    points.append((x,y))
d.line(points,fill=(83,103,40),width=9)
d.line(points,fill=(232,238,208),width=5)
finish(shadow(ball,(216,266,431,321)),"tennis")

# F1: original unbranded miniature, satin red body and carbon-fibre aero pieces.
car=canvas()
d=ImageDraw.Draw(car)
for box in [(179,98,231,151),(392,98,444,151),(179,239,231,297),(392,239,444,297)]:
    d.rounded_rectangle(box,radius=12,fill=(20,25,31),outline=(91,100,108),width=2)
    for x in range(box[0]+5,box[2]-4,5):
        d.line([(x,box[1]+6),(x,box[3]-6)],fill=(48,52,57),width=1)
textured_polygon(car,[(227,104),(397,104),(392,119),(232,119)],(36,43,49),8)
textured_polygon(car,[(178,269),(445,269),(438,296),(185,296)],(33,41,47),8)
textured_polygon(car,[(288,84),(337,84),(351,140),(371,168),(362,224),(336,256),(326,281),(300,281),(290,256),(264,224),(256,168),(277,140)],(175,43,46),6)
d=ImageDraw.Draw(car)
d.polygon([(305,84),(318,84),(322,276),(306,276)],fill=(227,217,194))
d.rounded_rectangle((285,157,342,215),radius=20,fill=(20,34,44),outline=(141,162,170),width=3)
d.arc((288,155,339,211),180,360,fill=(220,225,222),width=4)
for y in [119,248]:
    d.line([(215,y),(305,y+16)],fill=(98,108,115),width=4)
    d.line([(409,y),(326,y+16)],fill=(98,108,115),width=4)
d.line([(279,142),(266,170),(274,220)],fill=(226,99,96),width=3)
car=car.rotate(-24,Image.Resampling.BICUBIC,expand=False)
finish(shadow(car,(192,240,457,326)),"f1")
