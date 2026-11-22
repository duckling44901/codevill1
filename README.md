# 작은 세계 — Creator Town Demo

크리에이터가 만든 작은 웹 게임을 마을 산책과 개인 방 방문으로 발견하는 Three.js 데모입니다.

## 실행

```bash
npm install
npm run dev
```

Vite가 표시하는 로컬 주소를 브라우저에서 엽니다. 화면은 월드, UI, mock data, 원시 3D 모델 코드로 나뉘어 있습니다.

## 조작

- 마을에서 집이나 캐릭터 클릭: 프로필 보기 / 집 방문 메뉴
- WASD 또는 방향키: 플레이어 이동
- 마우스 드래그: 쿼터뷰 카메라 이동, 휠 또는 오른쪽 아래 +/- 버튼: 확대/축소
- 방 안 아케이드·모니터 클릭: 게임 소개와 외부 샘플 링크 열기
- 꾸미기 모드: 가구를 선택하고 빈 바닥으로 드래그해 격자 단위 이동, R로 회전
- ↺ 버튼: 방 가구 배치 초기화

게임 URL은 데모용 `example.com` 링크이므로 실제 게임으로 연결하려면 `src/data/creators.js`에서 교체하세요. 외부 사이트는 새 탭으로 열립니다. iframe 미리보기는 사이트의 보안 헤더에 따라 막힐 수 있어 기본 데모에는 넣지 않았습니다.

## 3D 에셋

Three.js의 단순 로우폴리 지오메트리로 데모를 즉시 렌더링합니다. Blender에서 독립 에셋을 내보내려면 Blender 3.6 이상이 설치된 환경에서 실행합니다.

```bash
blender --background --python scripts/create_assets.py
```

`public/assets/`에 `town_grid.glb`, `simple_house.glb`, `character_token.glb`, `room_shell.glb`, `arcade.glb`, `monitor.glb`, `chair.glb`, `table.glb`를 생성합니다. 와이어 오버레이가 필요하면 Blender viewport의 Wireframe 오버레이를 켤 수 있습니다. 웹 런타임은 데모가 별도 asset 빌드 없이 동작하도록 procedural 모델을 기본 사용합니다.
