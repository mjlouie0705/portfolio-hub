// Firebase 웹 앱 설정값 (Firebase 콘솔 > 프로젝트 설정 > 내 앱).
// 이 값들은 브라우저에 공개되는 "프로젝트 식별 정보"이며 비밀키가 아닙니다.
// 실제 보호는 firestore.rules(본인만 읽기/쓰기)와 Auth 승인 도메인 설정이 담당합니다.
// null 로 바꾸면 로그인 기능 없이 이 기기 저장 모드로만 동작합니다.
export const firebaseConfig = {
  apiKey: 'AIzaSyA3wAvnqO5OgbivoonwtVMwS2hPAZDETFU',
  authDomain: 'portfolio-hub-f3328.firebaseapp.com',
  projectId: 'portfolio-hub-f3328',
  appId: '1:746367008364:web:4f5c9d38d74413168fe249',
};
