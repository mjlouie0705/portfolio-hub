# 포트폴리오 공작소

학생 개인 포트폴리오를 주제로 바이브 코딩한 웹앱들을 모아 두는 허브입니다. 빌드 과정 없이 정적 파일로 동작하며 GitHub Pages로 배포합니다.

## 구조

```
index.html            허브 첫 화면
apps.js               허브에 등록된 앱 목록 (새 앱은 여기에 한 줄 추가)
assets/               공통 디자인 토큰(base.css)·스티커·허브 스크립트
apps/portfolio/       no.01 학생 개인 포트폴리오 (프론트엔드 전용)
```

## 로컬에서 보기

ES 모듈을 쓰므로 파일을 직접 열지 말고 간단한 서버로 띄우세요.

```bash
python3 -m http.server 8000
```

## 개인정보 원칙

- 포트폴리오 앱의 내용은 **사용자 브라우저의 localStorage에만** 저장되며 어떤 서버로도 전송되지 않습니다.
- 업로드한 사진은 캔버스로 다시 그려 저장하므로 촬영 위치 같은 EXIF 메타데이터가 남지 않습니다.
- 저장소에는 실명·학교·연락처·API 키 등을 커밋하지 않습니다. 예시 데이터는 모두 가상의 인물입니다.
- 각 페이지는 Content-Security-Policy로 외부 스크립트 실행을 막고, 사용자 입력은 `textContent`로만 화면에 출력합니다.

## 구글 로그인 + 클라우드 저장 (Firebase, 선택)

`apps/portfolio/firebase-config.js`가 `null`이면 로그인 버튼이 숨겨지고 기기 저장 모드로만 동작합니다. 켜는 방법:

1. Firebase 콘솔에서 프로젝트 생성 → **Authentication > 로그인 방법 > Google** 사용 설정
2. **Authentication > 설정 > 승인된 도메인**에 `<GitHub 사용자명>.github.io` 추가
3. **Firestore Database** 생성(프로덕션 모드) 후 이 저장소의 `firestore.rules` 배포
   ```bash
   firebase deploy --only firestore:rules --project <프로젝트 ID>
   ```
4. 프로젝트 설정 > 내 앱(웹 앱 추가)의 설정값을 `firebase-config.js`에 넣고 커밋

웹 설정값(apiKey 등)은 브라우저에 공개되는 프로젝트 식별 정보이며 비밀키가 아닙니다. 데이터 보호는 `firestore.rules`가 담당하며, **로그인한 본인만 자기 문서**(`portfolios/{uid}`)를 읽고 쓸 수 있고 다른 경로는 모두 거부됩니다. 서비스 계정 키(JSON)는 절대 커밋하지 마세요(.gitignore로 차단됨).
