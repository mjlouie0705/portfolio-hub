// 허브에 등록된 앱 목록. 새 앱을 만들면 apps/<폴더>/ 에 넣고 여기에 한 줄 추가하세요.
export const APPS = [
  {
    id: 'portfolio',
    title: '학생 개인 포트폴리오',
    summary: '나를 소개하고, 작품을 모으고, 성장 기록을 남기는 한 장짜리 포트폴리오. 내용은 내 브라우저에만 저장돼요.',
    path: 'apps/portfolio/',
    category: '포트폴리오',
    status: 'live',      // live | soon
    stack: '프론트엔드 전용',
    added: '2026-11-07',
    cover: 'brown',      // brown | blue | pink | green
    sticker: 'pencil',
  },
];

// 앞으로 만들 앱 아이디어(빈 슬롯으로 표시됩니다)
export const IDEAS = [
  { title: '독서 기록장', note: '읽은 책과 한 줄 감상', cover: 'blue', sticker: 'star' },
  { title: '프로젝트 회고 카드', note: '잘한 점 · 아쉬운 점 · 다음엔', cover: 'pink', sticker: 'heart' },
];
