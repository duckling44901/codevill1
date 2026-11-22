"""Generate simple, untextured low-poly GLB assets for the Little World demo.

Run with Blender 3.6+:
    blender --background --python scripts/create_assets.py

Each output is a small self-contained GLB in public/assets. Geometry uses flat
solid colors and an optional wire overlay in Blender for easy inspection.
"""
import bpy
import os
from math import radians

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'assets')
os.makedirs(OUT, exist_ok=True)


def clean_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)


def material(name, color):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    m.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value = (*color, 1)
    m.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value = 1
    return m


def cube(name, loc, scale, mat):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.object
    o.name = name
    o.dimensions = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    o.data.materials.append(mat)
    return o


def sphere(name, loc, scale, mat, segments=8, rings=6):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, radius=1, location=loc)
    o = bpy.context.object
    o.name = name
    o.scale = scale
    o.data.materials.append(mat)
    return o


def export(name, objects):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objects:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, name + '.glb'), export_format='GLB', use_selection=True, export_apply=True)


def finish(name, objects):
    export(name, objects)


def make_grid():
    clean_scene()
    m = material('Grid sage', (.78, .82, .75))
    base = cube('Town grid ground', (0, 0, 0), (12, .12, 12), m)
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.subdivide(number_cuts=12); bpy.ops.object.mode_set(mode='OBJECT')
    finish('town_grid', [base])


def make_house():
    clean_scene(); wall=material('Soft sage',(.55,.69,.57)); roof=material('Warm clay',(.80,.55,.40)); trim=material('Ivory',(.92,.88,.78))
    body=cube('House body',(0,.9,0),(2.8,1.8,2.5),wall)
    bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=2.05, depth=1.4, location=(0,2.5,0), rotation=(0,0,radians(45)))
    r=bpy.context.object; r.name='Simple roof'; r.scale.y=.84; r.data.materials.append(roof)
    door=cube('Door',(0,.58,1.27),(.62,1.16,.08),trim)
    objects=[body,r,door]
    for x in [-.82,.82]: objects.append(cube('Window',(x,1.2,1.29),(.48,.48,.08),trim))
    finish('simple_house',objects)


def make_character():
    clean_scene(); body=material('Character ochre',(.84,.67,.39)); skin=material('Face',(.91,.79,.64)); dark=material('Eyes',(.20,.23,.19))
    bpy.ops.mesh.primitive_uv_sphere_add(segments=8, ring_count=5, radius=1, location=(0,.54,0)); torso=bpy.context.object; torso.name='Capsule body'; torso.scale=(.3,.53,.28); torso.data.materials.append(body)
    head=sphere('Cube-like head',(0,1.15,0),(.28,.27,.27),skin)
    eyes=[sphere('Eye',(x,1.19,.24),(.035,.035,.025),dark,6,4) for x in [-.09,.09]]
    finish('character_token',[torso,head,*eyes])


def make_room():
    clean_scene(); floor_mat=material('Room floor',(.83,.79,.70)); wall_mat=material('Room wall',(.92,.90,.84))
    floor=cube('Square room floor',(0,0,0),(8,.12,8),floor_mat)
    back=cube('Back wall',(0,1.6,-4),(8,3.2,.14),wall_mat)
    left=cube('Left wall',(-4,1.6,0),(.14,3.2,8),wall_mat)
    finish('room_shell',[floor,back,left])


def make_furniture(kind):
    clean_scene(); wood=material('Light wood',(.70,.58,.43)); sage=material('Game cabinet',(.42,.55,.43)); screen=material('Screen',(.48,.66,.59)); blush=material('Chair',(.76,.55,.47))
    objects=[]
    if kind=='arcade':
        objects += [cube('Arcade cabinet',(0,.72,0),(.8,1.4,.6),sage),cube('Screen',(0,1.1,.32),(.56,.42,.05),screen),cube('Control panel',(0,.68,.12),(.7,.15,.4),wood),cube('Base',(0,.08,0),(.9,.14,.7),wood)]
    elif kind=='monitor':
        objects += [cube('Desk top',(0,.76,0),(1.4,.14,.7),wood),cube('Monitor',(0,1.17,-.12),(.82,.62,.12),sage),cube('Display',(0,1.17,-.05),(.66,.43,.025),screen),cube('Stand',(0,.92,-.1),(.14,.25,.14),wood)]
    elif kind=='chair':
        objects += [cube('Seat',(0,.62,0),(.72,.16,.68),blush),cube('Back',(0,1.03,-.28),(.72,.78,.13),blush)]
        for x in [-.25,.25]:
            for z in [-.22,.22]: objects.append(cube('Leg',(x,.3,z),(.09,.6,.09),wood))
    elif kind=='table':
        objects.append(cube('Table top',(0,.78,0),(1.35,.16,.82),wood))
        for x in [-.52,.52]:
            for z in [-.27,.27]: objects.append(cube('Leg',(x,.38,z),(.11,.75,.11),wood))
    finish(kind,objects)


make_grid(); make_house(); make_character(); make_room()
for item in ['arcade','monitor','chair','table']:
    make_furniture(item)
print('Exported GLB assets to', OUT)
