from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import subprocess

root=Path(__file__).resolve().parents[1]/'assets'
import tempfile
_tempdir=tempfile.TemporaryDirectory(prefix='portfolio-tour-')
temp=Path(_tempdir.name)
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
serif='/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
small=ImageFont.truetype(font,14); title=ImageFont.truetype(serif,38); body=ImageFont.truetype(font,19)
scenes=[
 ('feedback-hero.jpg','Feedback Analyser','Useful questions before confident answers.','#dce6d8'),
 ('lodges-mara.jpg','3G Lodges: Mara','A conversation built around the customer journey.','#f1dad3'),
 ('nomi-screens.jpg','Nomi Pay','Contextual support at the point of uncertainty.','#e3dceb'),
 ('cdos-flow.png','AI Content Design OS','Shared standards. Human judgement.','#dae6ee'),
]
for i,(filename,name,description,tint) in enumerate(scenes):
 im=Image.new('RGB',(1280,720),'#f3efe6');d=ImageDraw.Draw(im)
 d.text((55,30),'CHIKA NWAKANMA / SELECTED WORK',font=small,fill='#514d43')
 d.text((1180,30),f'0{i+1}/04',font=small,fill='#c8401f')
 d.line((55,68,1225,68),fill='#cfc8b6')
 d.text((55,91),name,font=title,fill='#16150f')
 d.text((55,150),description,font=body,fill='#514d43')
 d.rounded_rectangle((55,202,1225,638),radius=16,fill=tint)
 art=Image.open(root/filename).convert('RGB')
 scale=min(1080/art.width,382/art.height,1.7)
 art=art.resize((int(art.width*scale),int(art.height*scale)),Image.Resampling.LANCZOS)
 x=(1280-art.width)//2;y=420-art.height//2
 d.rounded_rectangle((x-7,y-7,x+art.width+7,y+art.height+7),radius=7,fill='#fffdf7')
 im.paste(art,(x,y))
 d.text((55,665),'PROJECT ARTEFACT TOUR  /  NOT A LIVE PRODUCT RECORDING',font=small,fill='#514d43')
 d.text((1075,665),'chika nwakanma.',font=small,fill='#c8401f')
 im.save(temp/f'{i}.png')
 if i==0: im.save(root/'tour-poster.jpg',quality=90)

args=['ffmpeg','-y','-hide_banner','-loglevel','error','-filter_complex_threads','1']
for i in range(4):args+=['-loop','1','-framerate','24','-t','6.6','-i',str(temp/f'{i}.png')]
filters='[0:v][1:v]xfade=transition=fade:duration=0.8:offset=5.8[v1];[v1][2:v]xfade=transition=fade:duration=0.8:offset=11.6[v2];[v2][3:v]xfade=transition=fade:duration=0.8:offset=17.4[v]'
args+=['-filter_complex',filters,'-map','[v]','-t','24','-r','24','-c:v','libx264','-preset','fast','-crf','27','-pix_fmt','yuv420p','-movflags','+faststart','-an',str(root/'portfolio-tour.mp4')]
subprocess.run(args,check=True)
root.joinpath('portfolio-tour.vtt').write_text('''WEBVTT

00:00.000 --> 00:05.800
Feedback Analyser. Useful questions before confident answers.

00:05.800 --> 00:11.600
3G Lodges: Mara. A conversation built around the customer journey.

00:11.600 --> 00:17.400
Nomi Pay. Contextual support at the point of uncertainty.

00:17.400 --> 00:24.000
AI Content Design OS. Shared standards. Human judgement.
''')
print('Created captioned 24-second visual tour:',(root/'portfolio-tour.mp4').stat().st_size,'bytes')
