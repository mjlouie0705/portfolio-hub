// Firebase(구글 로그인 + Firestore) 연동. firebase-config.js 가 비어 있으면 아무것도 하지 않습니다.
// 저장 구조 (본인만 접근 가능, firestore.rules 참고)
//   portfolios/{uid}                 프로필·기술·성장기록·작품 정보(사진 제외)
//   portfolios/{uid}/images/{workId} 작품 사진(축소된 JPEG data URL)
import { firebaseConfig } from './firebase-config.js';

const V = '10.14.1';
const CDN = `https://www.gstatic.com/firebasejs/${V}`;

let fb = null;        // loaded SDK modules
let auth = null, db = null, user = null;

export const enabled = !!(firebaseConfig && firebaseConfig.apiKey && firebaseConfig.projectId);

export async function init(onUser) {
  if (!enabled) return;
  const [app, a, f] = await Promise.all([
    import(`${CDN}/firebase-app.js`),
    import(`${CDN}/firebase-auth.js`),
    import(`${CDN}/firebase-firestore.js`),
  ]);
  fb = { ...a, ...f };
  const appInst = app.initializeApp(firebaseConfig);
  auth = a.getAuth(appInst);
  db = f.getFirestore(appInst);
  a.onAuthStateChanged(auth, (u) => { user = u; onUser(u); });
}

export async function signIn() {
  const provider = new fb.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  await fb.signInWithPopup(auth, provider);
}
export const signOut = () => fb.signOut(auth);
export const currentUser = () => user;

/** 클라우드에서 포트폴리오 읽기. 없으면 null */
export async function pull() {
  const ref = fb.doc(db, 'portfolios', user.uid);
  const snap = await fb.getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  const imgs = await fb.getDocs(fb.collection(db, 'portfolios', user.uid, 'images'));
  const byId = new Map(imgs.docs.map(d => [d.id, d.data().data]));
  data.projects = (data.projects || []).map(p => ({ ...p, image: byId.get(p.id) || '' }));
  return data;
}

let lastImages = new Map(); // workId -> image string last written

/** 전체 상태 저장. 사진은 바뀐 것만 따로 씁니다. */
export async function push(state) {
  const uid = user.uid;
  const batch = fb.writeBatch(db);
  const projects = state.projects.map(({ image, ...rest }) => rest);
  batch.set(fb.doc(db, 'portfolios', uid), {
    profile: state.profile, skills: state.skills, journal: state.journal, projects,
    updated: state.updated, v: 1,
  });
  const ids = new Set(state.projects.map(p => p.id));
  for (const p of state.projects) {
    if (lastImages.get(p.id) === p.image) continue;
    const ref = fb.doc(db, 'portfolios', uid, 'images', p.id);
    if (p.image) batch.set(ref, { data: p.image }); else batch.delete(ref);
    lastImages.set(p.id, p.image);
  }
  for (const id of [...lastImages.keys()]) {
    if (!ids.has(id)) { batch.delete(fb.doc(db, 'portfolios', uid, 'images', id)); lastImages.delete(id); }
  }
  await batch.commit();
}

/** pull 직후 호출해 "이미 올라간 사진" 상태를 맞춥니다 */
export function markSynced(state) {
  lastImages = new Map(state.projects.map(p => [p.id, p.image]));
}
export function resetSync() { lastImages = new Map(); }
