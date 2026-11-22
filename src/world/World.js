import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { makeHouse, makePerson, makeFurniture, makeWorldTree, makeLamp } from './primitives.js';

export class World {
  constructor(host, creators) {
    this.host = host; this.creators = creators; this.mode = 'world'; this.decorating = false;
    this.scene = new THREE.Scene(); this.scene.background = new THREE.Color('#e8eee4');
    this.camera = new THREE.OrthographicCamera(-11, 11, 7.2, -7.2, .1, 100);
    this.camera.position.set(13, 15, 17); this.camera.lookAt(0, 0, 0);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.14;
    host.append(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement); this.controls.target.set(0,0,0);
    this.controls.enableRotate = false; this.controls.enablePan = true; this.controls.enableDamping = true;
    this.controls.minZoom = .7; this.controls.maxZoom = 1.5; this.controls.zoomSpeed = .6;
    this.raycaster = new THREE.Raycaster(); this.pointer = new THREE.Vector2(); this.keys = new Set(); this.movable = [];
    this.addLights(); this.makeTerrain(); this.makeWorld(); this.makeRoom(); this.installInput(); this.resize(); this.animate();
  }
  addLights() {
    this.scene.add(new THREE.HemisphereLight('#fffdf0','#9da995',2.0));
    const sun = new THREE.DirectionalLight('#fff2d4',2.2); sun.position.set(-8,15,10); sun.castShadow = true;
    sun.shadow.mapSize.set(1024,1024); sun.shadow.camera.left=-18; sun.shadow.camera.right=18; sun.shadow.camera.top=18; sun.shadow.camera.bottom=-18; this.scene.add(sun);
  }
  makeTerrain() {
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.MeshStandardMaterial({color:'#e2e9dc',roughness:1}));
    ground.rotation.x=-Math.PI/2; ground.position.y=-.08; ground.receiveShadow=true; ground.userData.ground=true; this.scene.add(ground);
    const grid = new THREE.GridHelper(24,24,'#d0dacb','#d6dfd1'); grid.position.y=-.065;
    grid.material.transparent=true; grid.material.opacity=.44; this.scene.add(grid);
    this.scene.add(makeWorldTree(-9,0,-7,'#a8bd97'),makeWorldTree(9,0,-8,'#c0c79b'),makeWorldTree(-9,0,5,'#d9b794'),makeWorldTree(9,0,6,'#9fbcae'));
    this.scene.add(makeLamp(-7,0,3),makeLamp(7,0,-1));
    const pathMat=new THREE.MeshStandardMaterial({color:'#eee6d5',roughness:1});
    for(let i=0;i<5;i++){const p=new THREE.Mesh(new THREE.BoxGeometry(1.5,.035,1.05),pathMat);p.position.set(-1.1,0,-3+i*1.3);p.rotation.y=-.15;p.receiveShadow=true;this.scene.add(p)}
  }
  makeWorld() {
    this.worldGroup=new THREE.Group(); this.scene.add(this.worldGroup);
    this.creators.forEach((c,index)=>{
      const group=new THREE.Group(); group.position.set(...c.position); group.userData.creator=c; group.name=`house-${c.id}`;
      const house=makeHouse(c.color,c.accent); group.add(house);
      const person=makePerson(c.accent); person.position.set(1.55,.02,1.25); person.userData.creator=c; group.add(person);
      const badge=new THREE.Mesh(new THREE.CircleGeometry(.34,32),new THREE.MeshBasicMaterial({color:'#fffdf6'}));badge.rotation.x=-Math.PI/2;badge.position.set(0,.015,2.0);group.add(badge);
      const marker=new THREE.Mesh(new THREE.CircleGeometry(.22,32),new THREE.MeshBasicMaterial({color:c.accent}));marker.rotation.x=-Math.PI/2;marker.position.set(0,.025,2);group.add(marker);
      group.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;if(o.userData.clickable||o===person)o.userData.creator=c}});
      this.worldGroup.add(group);
    });
    this.player=makePerson('#f0c879'); this.player.position.set(0,.02,2.8); this.worldGroup.add(this.player);
    this.makeNameTags();
  }
  makeNameTags() {
    this.labels=[];
    this.creators.forEach(c=>{
      const el=document.createElement('div');el.className='creator-label';el.innerHTML=`<span class="creator-label-dot" style="--dot:${c.accent}"></span>${c.name}<small>${c.title}</small>`;
      this.host.append(el);this.labels.push({el,position:new THREE.Vector3(c.position[0],2.65,c.position[2])});
    });
  }
  makeRoom() {
    this.roomGroup=new THREE.Group(); this.scene.add(this.roomGroup);
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(9,9),new THREE.MeshStandardMaterial({color:'#eee7d8',roughness:1}));
    floor.rotation.x=-Math.PI/2; floor.position.y=0;floor.receiveShadow=true;floor.userData.ground=true;this.roomGroup.add(floor);
    const grid=new THREE.GridHelper(9,9,'#d7cfc0','#ded7ca');grid.position.y=.012;grid.material.transparent=true;grid.material.opacity=.55;this.roomGroup.add(grid);
    const wallMat=new THREE.MeshStandardMaterial({color:'#f5f1e8',roughness:1});
    const walls=[[[0,1.8,-4.5],[9,3.6,.18]], [[-4.5,1.8,0],[.18,3.6,9]], [[4.5,1.8,0],[.18,3.6,9]]];
    walls.forEach(([p,s])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(...s),wallMat);m.position.set(...p);m.castShadow=true;m.receiveShadow=true;this.roomGroup.add(m)});
    this.roomGrid=new THREE.GridHelper(9,9,'#b8c7ad','#d8dfd1');this.roomGrid.position.y=.025;this.roomGrid.visible=false;this.roomGroup.add(this.roomGrid);
    this.furnitureGroup=new THREE.Group();this.roomGroup.add(this.furnitureGroup);this.furniture=[];
    const layouts=[{kind:'arcade',p:[-2.8,0,-2.5],label:'GAME'},{kind:'monitor',p:[0,0,-3.25],label:'PLAY'},{kind:'chair',p:[1.8,0,-.3]},{kind:'table',p:[-1.7,0,.2]},{kind:'chair',p:[2.3,0,1.0]}];
    layouts.forEach((d,i)=>{const obj=makeFurniture(d.kind);obj.position.set(...d.p);obj.rotation.y=i%2?Math.PI/2:0;obj.userData={...obj.userData,kind:d.kind,index:i,original:{p:[...d.p],r:obj.rotation.y}};obj.traverse(m=>{if(m.isMesh){m.castShadow=true;m.receiveShadow=true}});this.furnitureGroup.add(obj);this.furniture.push(obj)});
    const door=new THREE.Group(); door.position.set(0,0,4.38); const frame=new THREE.Mesh(new THREE.BoxGeometry(1.3,2.2,.1),new THREE.MeshStandardMaterial({color:'#a9b995'}));frame.position.y=1.1;door.add(frame);const slab=new THREE.Mesh(new THREE.BoxGeometry(1.04,1.94,.12),new THREE.MeshStandardMaterial({color:'#ddc29b'}));slab.position.set(0,1.02,.06);door.add(slab);const knob=new THREE.Mesh(new THREE.SphereGeometry(.06,10,8),new THREE.MeshStandardMaterial({color:'#d2a957'}));knob.position.set(.35,.95,.14);door.add(knob);door.userData.exit=true;const trigger=new THREE.Mesh(new THREE.BoxGeometry(1.25,2.3,.35),new THREE.MeshBasicMaterial({visible:false}));trigger.position.set(0,1.1,.1);trigger.userData.exit=true;door.add(trigger);this.roomGroup.add(door);
    this.roomGroup.visible=false;
  }
  installInput() {
    const dom=this.renderer.domElement;
    dom.addEventListener('pointerdown',e=>{if(e.button!==0)return;this.down={x:e.clientX,y:e.clientY};if(this.decorating&&this.mode==='room'){const hit=this.hit(e);if(hit&&this.findFurniture(hit.object)){this.selectedFurniture=this.findFurniture(hit.object);this.dragFurniture=true;this.controls.enabled=false;}}});
    dom.addEventListener('pointerup',e=>{if(this.dragFurniture){this.dragFurniture=false;this.controls.enabled=true;return}if(!this.down||Math.hypot(e.clientX-this.down.x,e.clientY-this.down.y)>5){this.down=null;return}const hit=this.hit(e);if(!hit){this.down=null;return}let obj=hit.object;while(obj&&!obj.userData.creator&&!obj.userData.kind&&!obj.userData.exit)obj=obj.parent;if(obj?.userData.exit){this.onExit?.();this.down=null;return}if(this.mode==='world'&&obj?.userData.creator)this.onSelect?.(obj.userData.creator,{x:e.clientX,y:e.clientY});else if(this.mode==='room'){const item=this.findFurniture(hit.object);if(item?.userData.kind==='arcade'||item?.userData.kind==='monitor')this.onGame?.(this.currentCreator)}this.down=null;});
    dom.addEventListener('pointermove',e=>{if(this.dragFurniture&&this.selectedFurniture){const p=this.floorPoint(e);if(p){this.selectedFurniture.position.x=Math.round(p.x);this.selectedFurniture.position.z=Math.round(p.z)}}});
    dom.addEventListener('contextmenu',e=>e.preventDefault());
    window.addEventListener('keydown',e=>{if(['w','a','s','d','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','r','R'].includes(e.key)){this.keys.add(e.key.toLowerCase());if(e.key.toLowerCase()==='r'&&this.decorating&&this.selectedFurniture)this.selectedFurniture.rotation.y+=Math.PI/2}});
    window.addEventListener('keyup',e=>this.keys.delete(e.key.toLowerCase()));
    dom.addEventListener('wheel',e=>{if(this.mode==='world')return},{passive:true});
    this.onExit=()=>this.onBack?.();
    document.querySelectorAll('.zoom-control button').forEach((b,i)=>b.addEventListener('click',()=>{this.camera.zoom=THREE.MathUtils.clamp(this.camera.zoom+(i===0?.1:-.1),.7,1.5);this.camera.updateProjectionMatrix()}));
  }
  findFurniture(obj){while(obj&&obj!==this.roomGroup){if(obj.userData?.kind)return obj;obj=obj.parent}return null}
  floorPoint(e){const rect=this.renderer.domElement.getBoundingClientRect();this.pointer.set((e.clientX-rect.left)/rect.width*2-1,-((e.clientY-rect.top)/rect.height)*2+1);this.raycaster.setFromCamera(this.pointer,this.camera);const plane=new THREE.Plane(new THREE.Vector3(0,1,0),0);const out=new THREE.Vector3();return this.raycaster.ray.intersectPlane(plane,out)?out:null}
  hit(e){const r=this.renderer.domElement.getBoundingClientRect();this.pointer.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);this.raycaster.setFromCamera(this.pointer,this.camera);const roots=this.mode==='world'?[this.worldGroup]:[this.roomGroup];return this.raycaster.intersectObjects(roots,true)[0]}
  show(mode,creator){this.mode=mode;this.currentCreator=creator;this.worldGroup.visible=mode==='world';this.roomGroup.visible=mode==='room';this.player.visible=mode==='world';this.labels.forEach(x=>x.el.classList.toggle('hidden',mode!=='world'));document.querySelector('#world-hud').classList.toggle('hidden',mode!=='world');document.querySelector('#room-hud').classList.toggle('hidden',mode!=='room');this.controls.target.set(mode==='world'?0:0,0,mode==='world'?0:0);this.camera.position.set(mode==='world'?13:9,mode==='world'?15:12,mode==='world'?17:11);this.camera.zoom=mode==='world'?.88:1.14;this.camera.updateProjectionMatrix();this.controls.update()}
  setDecorating(on){this.decorating=on;this.roomGrid.visible=on;if(!on&&this.selectedFurniture){this.selectedFurniture=null}}
  resetFurniture(){this.furniture.forEach(o=>{o.position.set(...o.userData.original.p);o.rotation.y=o.userData.original.r})}
  resize(){const w=this.host.clientWidth,h=this.host.clientHeight;if(!w||!h)return;const aspect=w/h;const span=11;this.camera.left=-span*aspect/1.6;this.camera.right=span*aspect/1.6;this.camera.top=span/1.6;this.camera.bottom=-span/1.6;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h);this.updateLabels()}
  updateLabels(){this.labels?.forEach(({el,position})=>{const p=position.clone().project(this.camera);el.style.left=`${(p.x*.5+.5)*this.host.clientWidth}px`;el.style.top=`${(-p.y*.5+.5)*this.host.clientHeight}px`})}
  animate=()=>{requestAnimationFrame(this.animate);const delta=.09;if(this.mode==='world'&&this.keys.size){const dir=new THREE.Vector3((this.keys.has('d')||this.keys.has('arrowright')?1:0)-(this.keys.has('a')||this.keys.has('arrowleft')?1:0),0,(this.keys.has('s')||this.keys.has('arrowdown')?1:0)-(this.keys.has('w')||this.keys.has('arrowup')?1:0));if(dir.lengthSq()){dir.normalize();this.player.position.addScaledVector(dir,delta);this.player.position.x=THREE.MathUtils.clamp(this.player.position.x,-9,9);this.player.position.z=THREE.MathUtils.clamp(this.player.position.z,-8,7)}}this.controls.update();this.updateLabels();this.renderer.render(this.scene,this.camera)};
}
