export function renderShell() {
  return `
    <main class="app-shell">
      <header class="topbar">
        <a class="brand" href="#" aria-label="작은 세계 홈"><span class="brand-mark">⌂</span><span>작은 세계<small>CREATOR TOWN</small></span></a>
        <div class="top-center"><span class="live-dot"></span><span id="status">마을 광장</span><span class="top-divider">·</span><span class="soft-label">오늘도 좋은 하루</span></div>
        <button class="profile-chip"><span class="my-avatar">나</span><span>내 공간</span><span class="chevron">⌄</span></button>
      </header>
      <section id="stage" class="stage">
        <div class="scene-wash"></div>
        <div class="stage-heading" id="world-view">
          <div class="eyebrow"><span>✳</span> LITTLE WORLD, BIG IDEAS</div>
          <h1>오늘은 어디로<br /><em>놀러 가볼까요?</em></h1>
          <p>마을을 거닐다 마음에 드는 집에 들러보세요.</p>
          <div class="creator-count"><span class="avatar-stack"><i>모</i><i>나</i><i>도</i></span><b>3</b>명의 크리에이터가 기다리고 있어요</div>
        </div>
        <div class="room-heading hidden" id="room-view"><button id="back-to-world" class="back-button">← <span>마을로</span></button><div class="eyebrow">MY LITTLE SPACE</div><h1 id="room-heading">모리의 방</h1><p>방 안의 오브젝트를 눌러 작품을 만나보세요.</p></div>
        <div id="scene" class="scene-canvas" aria-label="인터랙티브 크리에이터 마을"></div>
        <div class="map-label map-label-one"><span>✿</span> 햇살 정원</div><div class="map-label map-label-two"><span>⌁</span> 느린 산책길</div>
        <aside class="side-note"><span class="note-icon">✳</span><span>크리에이터의 작은 세계를<br />직접 탐험해보세요.</span><span class="note-tail">↘</span></aside>
        <div class="bottom-hud" id="world-hud"><div class="key-hint"><span class="keycap">W</span><span class="keycap">A</span><span class="keycap">S</span><span class="keycap">D</span><span>캐릭터 이동</span></div><div class="drag-hint"><span class="mouse-icon">⌖</span> 드래그해서 둘러보기</div><div class="zoom-control"><button aria-label="확대">+</button><span>100%</span><button aria-label="축소">−</button></div></div>
        <div class="room-hud hidden" id="room-hud"><div class="room-controls"><span class="keycap">클릭</span> 게임 오브젝트 살펴보기</div><div id="decorate-hint" class="decorate-hint hidden">가구를 클릭하고 빈 바닥을 눌러 이동 · <b>R</b> 회전</div><button id="decorate-toggle" class="decorate-button"><span>✳</span> 꾸미기 모드</button><button id="reset-furniture" class="reset-button" title="가구 위치 초기화">↺</button></div>
        <div class="sun-stamp">EST.<br /><b>2025</b><span>♡</span></div>
      </section>
      <footer class="bottombar"><div class="footer-left"><span class="weather-icon">☀</span><span>맑음 <b>22°</b></span><span class="footer-sep"></span><span>가을의 어느 날</span></div><div class="footer-center"><span>어디선가 들려오는 작은 멜로디</span><span class="sound-bars"><i></i><i></i><i></i><i></i><i></i></span></div><div class="footer-right"><span>✿</span> 만든 사람들의 놀이터 <span class="footer-dot">·</span> <b>WORLD 01</b></div></footer>
      <div id="modal-root"></div>
    </main>`;
}
