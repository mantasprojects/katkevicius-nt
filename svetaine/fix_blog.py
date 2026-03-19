import sys
import re

path = r"c:\Users\manta\OneDrive\Desktop\SVETAINĖ\svetaine\src\data\blog-posts.json"

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the item with ID badf0244-bc83-4c4c-82b5-cafbf463470e
# We want to replace the excerpt and content fields.

# Let's find the start of the item
anchor = '"id": "badf0244-bc83-4c4c-82b5-cafbf463470e"'
start_idx = content.find(anchor)

if start_idx == -1:
    print("Could not find item anchor")
    sys.exit(1)

# Find the next item or end of current item
# The current item ends before the next { or ]
# Or we can just find the "category" field which is intact.
category_idx = content.find('"category": "Patarimai"', start_idx)

if category_idx == -1:
    print("Could not find category anchor")
    sys.exit(1)

# Now we have the range containing the broken excerpt and content
# It's between slug and category
slug_idx = content.find('"slug": "nt-skelbimu-fotografija-kaunas"', start_idx)
if slug_idx == -1:
    print("Could not find slug anchor")
    sys.exit(1)

# Find the end of the slug line (there's a comma and newline usually)
line_end = content.find('\n', slug_idx)
while content[line_end+1].isspace():
    line_end += 1

# We want to replace everything from line_end to the start of "category": "Patarimai"
# To be safe, let's just replace the exact broken text block.

broken_block_start = content.find('"excerpt":', slug_idx)
broken_block_end = content.rfind('\n', 0, category_idx) # just before category line

# Make sure broken_block_start is BEFORE category_idx
if broken_block_start > category_idx:
    print("Invalid indices")
    sys.exit(1)

correct_text = '''    "excerpt": "Vizualinis Turto Magnetas: Fotografijos GaliaŠiuolaikinis pirkėjas internete skelbimui skiria vos 3 sekundes. Jei nuotraukos darytos telefonu tamsoje,...",
    "content": "<h2>Vizualinis Turto Magnetas: Fotografijos Galia</h2><p>Šiuolaikinis pirkėjas internete skelbimui skiria vos 3 sekundes. Jei nuotraukos darytos telefonu tamsoje, net ir geriausias butas Dainavoje ar loftas Šančiuose liks nepastebėtas.</p><h3>Šviesa ir Erdvės Kampai Loftuose</h3><p>Populiarūs Kauno loftai (pvz., buvusiose gamyklose) pasižymi aukštomis lubomis ir dideliais langais. Profesionalus fotografas naudoja plačiakampį objektyvą ir išnaudoja natūralią šviesą, suteikdamas erdvei erdvumo pojūtį, kurio pirkėjas ieško.</p><h3>Technologinis Pranašumas</h3><p>Geras skelbimas Kaune šiandien turi turėti:</p><ul><li>Profesionalias, retušuotas Hdr nuotraukas</li><li>3D virtualų turą (Matterport)</li><li>Drono kadrus iš viršaus (ypač svarbu namams ir sklypams)</li></ul><p>Tai filtruoja smalsuolius ir pritraukia tik motyvuotus pirkėjus.</p><h3>Aukščiausio lygio pateikimas</h3><p>Visiems savo parduodamiems objektams užsakau premium fotografijos paslaugas. <a href=\\"/konsultacija\\">Pasikonsultuokite prieš parduodami</a> ir suplanuosime tobulą fotosesiją.</p>",
'''

new_content = content[:broken_block_start] + correct_text + content[category_idx-4:] # -4 to leave space/newline if needed, but let's be absolute

# Safer: replace exactly the broken text if we can isolate it.
# The broken text ends with: ir suplanuosime tobulą fotosesiją.</p>",
broken_text_end_sub = 'ir suplanuosime tobulą fotosesiją.</p>",'
broken_text_end_idx = content.find(broken_text_end_sub, broken_block_start) + len(broken_text_end_sub)

if broken_text_end_idx < broken_block_start:
    print("Could not find end of broken text")
    sys.exit(1)

new_content_safe = content[:broken_block_start] + correct_text + content[broken_text_end_idx+1:] # +1 to skip comma/newline overlap maybe?

# Let's verify new_content_safe length or snippet
print("Replacing block of length:", broken_text_end_idx - broken_block_start)

# Write back
with open(path, 'w', encoding='utf-8') as f:
    f.write(content[:broken_block_start] + correct_text + content[broken_text_end_idx:])

print("Fixed.")
