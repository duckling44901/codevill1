import * as THREE from 'three';
const mat=(color,roughness=1)=>new THREE.MeshStandardMaterial({color,roughness,flatShading:true});
function box(parent,name,size,pos,color){const o=new THREE.Mesh(new THREE.BoxGeometry(...size),mat(color));o.name=name;o.position.set(...pos);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
export function makeHouse(wall='#8fb59b',roof='#eead75'){
  const g=new THREE.Group();box(g,'House body',[2.8,1.75,2.5],[0,.92,0],wall);
  const roofGeo=new THREE.ConeGeometry(2.3,1.45,4);const r=new THREE.Mesh(roofGeo,mat(roof));r.position.set(0,2.48,0);r.rotation.y=Math.PI/4;r.scale.z=.82;r.castShadow=true;g.add(r);
  const door=box(g,'Door',[.64,1.2,.08],[0,.62,1.29],'#e9d7b6');door.userData.clickable=true;
  for(const x of [-.83,.83]){const w=box(g,'Window',[.48,.48,.08],[x,1.2,1.3],'#eaf0e8');w.userData.clickable=true;const cross=box(g,'Window cross',[.045,.48,.1],[x,1.2,1.35],'#8c9f8d');box(g,'Window crossbar',[.48,.045,.1],[x,1.2,1.35],'#8c9f8d')}
  return g;
}
export function makePerson(color='#efc879'){
  const g=new THREE.Group();const body=new THREE.Mesh(new THREE.CapsuleGeometry(.3,.48,3,6),mat(color));body.position.y=.56;body.castShadow=true;g.add(body);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.27,8,6),mat('#f1d9ba'));head.position.y=1.14;head.castShadow=true;g.add(head);
  const eyes=mat('#4c5149');for(const x of [-.09,.09]){const e=new THREE.Mesh(new THREE.SphereGeometry(.025,6,4),eyes);e.position.set(x,1.18,.245);g.add(e)}
  return g;
}
export function makeFurniture(kind){
  const g=new THREE.Group();g.userData.kind=kind;
  if(kind==='arcade'){
    box(g,'cabinet',[.8,1.42,.62],[0,.72,0],'#788d77');const screen=box(g,'screen',[.57,.42,.06],[0,1.08,.33],'#d1e4ce');screen.userData.game=true;box(g,'screen dark',[.45,.29,.035],[0,1.08,.37],'#7e9f87');box(g,'control deck',[.7,.16,.4],[0,.69,.12],'#e2bc78');for(const x of [-.17,.17]){const b=new THREE.Mesh(new THREE.SphereGeometry(.055,8,6),mat(x<0?'#e48f78':'#849ec5'));b.position.set(x,.81,.27);g.add(b)}box(g,'base',[.92,.14,.7],[0,.07,0],'#657861');
  } else if(kind==='monitor'){
    box(g,'desk',[1.38,.14,.7],[0,.76,0],'#d3b590');box(g,'monitor',[.82,.62,.12],[0,1.16,-.13],'#899b89');const scr=box(g,'screen',[.67,.44,.035],[0,1.17,-.055],'#bad5ca');scr.userData.game=true;box(g,'monitor foot',[.14,.25,.16],[0,.93,-.12],'#899b89');box(g,'keyboard',[.53,.045,.2],[0,.86,.2],'#e8e4d9');box(g,'desk leg',[.12,.72,.12],[-.52,.36,0],'#b89a76');box(g,'desk leg',[.12,.72,.12],[.52,.36,0],'#b89a76');
  } else if(kind==='chair'){
    box(g,'seat',[.72,.16,.68],[0,.63,0],'#d7a38d');box(g,'back',[.72,.82,.13],[0,1.05,-.29],'#ca947f');for(const x of [-.26,.26])for(const z of [-.22,.22])box(g,'chair leg',[.09,.62,.09],[x,.31,z],'#a7806b');
  } else {
    box(g,'table top',[1.35,.16,.82],[0,.78,0],'#c9b28f');for(const x of [-.52,.52])for(const z of [-.27,.27])box(g,'table leg',[.11,.75,.11],[x,.38,z],'#ac9679');
  }
  return g;
}
export function makeWorldTree(x,y,z,color){const g=new THREE.Group();g.position.set(x,y,z);const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.13,.2,.9,5),mat('#a98668'));trunk.position.y=.42;g.add(trunk);const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(.8,0),mat(color));crown.position.y=1.25;crown.scale.set(1,1.12,.95);crown.castShadow=true;g.add(crown);const fruit=new THREE.Mesh(new THREE.SphereGeometry(.09,7,5),mat('#e7bf71'));fruit.position.set(.4,1.37,.43);g.add(fruit);return g}
export function makeLamp(x,y,z){const g=new THREE.Group();g.position.set(x,y,z);const pole=new THREE.Mesh(new THREE.CylinderGeometry(.045,.06,1.7,6),mat('#879482'));pole.position.y=.85;g.add(pole);const cap=new THREE.Mesh(new THREE.ConeGeometry(.32,.25,6),mat('#e5ce93'));cap.position.y=1.78;g.add(cap);const bulb=new THREE.Mesh(new THREE.SphereGeometry(.18,8,6),mat('#f8edc3'));bulb.position.y=1.62;g.add(bulb);return g}
