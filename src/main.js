import './style.css';
import { World } from './world/World.js';
import { creators } from './data/creators.js';
import { renderShell } from './ui/shell.js';

const app = document.querySelector('#app');
app.innerHTML = renderShell();
const world = new World(document.querySelector('#scene'), creators);

let currentCreator = creators[0];
let decorating = false;
const status = document.querySelector('#status');

function setScene(scene, creator = currentCreator) {
  currentCreator = creator;
  world.show(scene, creator);
  document.querySelector('#world-view').classList.toggle('hidden', scene !== 'world');
  document.querySelector('#room-view').classList.toggle('hidden', scene !== 'room');
  document.querySelector('#room-heading').textContent = `${creator.name}의 방`;
  status.textContent = scene === 'world' ? '마을 광장' : `${creator.name}의 아늑한 방`;
  closePopup();
  closeModal();
}

function openPopup(creator, x, y) {
  closePopup();
  const popup = document.createElement('div');
  popup.className = 'context-popover';
  popup.style.left = `${Math.max(16, Math.min(x, innerWidth - 220))}px`;
  popup.style.top = `${Math.max(72, Math.min(y, innerHeight - 130))}px`;
  popup.innerHTML = `<div class="popover-title">${creator.name}의 집</div><button data-action="profile">프로필 보기 <span>↗</span></button><button data-action="visit">집 방문하기 <span>→</span></button>`;
  popup.addEventListener('click', (event) => {
    const action = event.target.closest('button')?.dataset.action;
    if (action === 'profile') openProfile(creator);
    if (action === 'visit') setScene('room', creator);
  });
  document.body.append(popup);
  setTimeout(() => document.addEventListener('pointerdown', outsidePopup, { once: true }), 0);
}
function outsidePopup(e) { if (!e.target.closest('.context-popover')) closePopup(); }
function closePopup() { document.querySelector('.context-popover')?.remove(); }

function openModal(content) {
  const root = document.querySelector('#modal-root');
  root.innerHTML = `<div class="modal-backdrop"><section class="modal-card">${content}<button class="modal-close" aria-label="닫기">×</button></section></div>`;
  root.querySelector('.modal-backdrop').addEventListener('click', e => { if (e.target.classList.contains('modal-backdrop')) closeModal(); });
  root.querySelector('.modal-close').addEventListener('click', closeModal);
}
function closeModal() { document.querySelector('#modal-root').innerHTML = ''; }
function openProfile(creator) {
  closePopup();
  openModal(`<div class="modal-kicker">CREATOR PROFILE</div><div class="profile-avatar" style="--avatar:${creator.color}">${creator.name.slice(0,1)}</div><h2>${creator.name}</h2><p class="profile-intro">${creator.intro}</p><div class="profile-home">⌂　${creator.title}</div><button class="primary-button visit-profile">집 구경하기 <span>→</span></button>`);
  document.querySelector('.visit-profile').addEventListener('click', () => setScene('room', creator));
}
function openGame(creator) {
  const game = creator.game;
  openModal(`<div class="modal-kicker">CREATOR GAME · ${creator.name}</div><div class="game-art" style="--art:${creator.accent}"><span>${game.thumbnail}</span><small>NOW PLAYING</small></div><h2>${game.title}</h2><p class="profile-intro">${game.description}</p><a class="primary-button" href="${game.url}" target="_blank" rel="noreferrer">게임 사이트 바로가기 <span>↗</span></a><p class="link-note">새 창에서 데모 링크가 열립니다.</p>`);
}

world.onSelect = (creator, point) => openPopup(creator, point.x, point.y);
world.onGame = openGame;
world.onBack = () => setScene('world');
document.querySelector('#back-to-world').addEventListener('click', () => setScene('world'));
document.querySelector('#decorate-toggle').addEventListener('click', (event) => {
  decorating = !decorating;
  event.currentTarget.classList.toggle('active', decorating);
  event.currentTarget.innerHTML = decorating ? '<span>✓</span> 꾸미기 완료' : '<span>✳</span> 꾸미기 모드';
  world.setDecorating(decorating);
  document.querySelector('#decorate-hint').classList.toggle('hidden', !decorating);
});
document.querySelector('#reset-furniture').addEventListener('click', () => world.resetFurniture());
document.querySelector('#modal-root').addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closePopup(); closeModal(); } });
window.addEventListener('resize', () => world.resize());
setScene('world');
