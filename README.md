# QR MENU · 바글바글

테이블에서 QR을 찍어 사진과 함께 메뉴를 읽는 모바일 중심 웹 메뉴판입니다. 한국어·영어·중국어 간체·중국어 번체를 지원합니다.

현재는 **Supabase에서 실제 매장 메뉴를 조회하는 손님용 프론트엔드**입니다. 로그인 없이 공개된 카테고리·메뉴를 읽습니다. 최초 접속·새로고침·탭 재활성화 때 DB를 조회하며, DB에서 바꾼 가격·품절 상태도 다음 조회에 반영됩니다. 지속 구독 방식의 실시간 갱신은 사용하지 않습니다.

2026-10-25에 Supabase에 카테고리·메뉴 테이블과 RLS를 적용하고 프론트엔드를 연결했습니다. 초기 데이터는 2026-10-24 네이버 주문의 매장 가격을 기준으로 카테고리 4개·메뉴 19개를 등록했습니다. [DB 구조·권한·SQL 적용 방법](docs/DATABASE.md)을 참고하세요.

## 구현한 기능

- 상호·언어 선택 → 가로 스크롤 카테고리 → 음식 카드로 이어지는 간결한 화면 (구분선은 카테고리 위에 배치)
- 사진·메뉴명·가격을 보여주는 실제 메뉴 카드 19개
- 전체 / 식사류 / 고기류 / 냉면·사이드 / 주류·음료 카테고리 탐색
- 사진·설명·원산지·알레르기 정보를 보여주는 상세 모달
- 품절 메뉴 표시와 품절 메뉴의 상세 조회
- 네 언어 선택, URL·기기 저장값·브라우저 언어에 따른 초기 언어 설정
- 모바일 2열, 좁은 화면 1열, 태블릿 3열, PC 4열 반응형 배치
- 모달 내부 스크롤, 배경 스크롤 잠금, 키보드 초점 관리
- 뒤로가기·닫기·Escape로 상세 닫기, 목록 위치와 초점 복원
- 로딩·빈 목록·조회 실패·재시도·이미지 실패 상태

대상 매장은 **바글바글해장국몸국(제주 제주시 우정로5길 10)**입니다. 메뉴·가격·등록 사진은 공개 매장 자료를 반영했고, 네 언어 번역과 짧은 설명은 이 프로젝트에서 작성했습니다. 초기 알레르기 정보는 모두 미검수 상태입니다. [자료 출처·가격 비교·반영 기준](docs/RESTAURANT_DATA.md)에 결정 사항과 근거를 기록했습니다. 주문·장바구니·결제·ASK·분석 도구·관리자 화면은 포함하지 않습니다.

상호는 **바글바글**이며, 헤더 로고는 [조선일보 공식 배포 조선궁서체](https://event.chosun.com/100/100font.html)를 사용했습니다. 궁서체 획을 살짝 두껍게 하고 흰색 채움·짙은 테두리·글자 끝의 빨강/파랑/노랑/초록 포인트를 적용했습니다. 네 글자의 윤곽을 SVG로 출력해 별도 웹폰트 다운로드 없이 모든 기기에서 같은 궁서체가 보입니다. 글꼴의 지적재산권은 (주)조선일보사에 있습니다. 원본 글꼴 파일은 저장소에 포함하지 않습니다. 로고는 `src/components/BrandWordmark.tsx`에서 수정합니다.

## 화면

![PC 메뉴판](docs/screenshots/menu-desktop.jpg)

<details>
<summary>모바일 메뉴판 보기</summary>

![모바일 메뉴판](docs/screenshots/menu-mobile.jpg)

</details>

## 시작하기

Node.js 22.12 이상과 npm을 사용합니다.

```bash
git clone https://github.com/kohyunseok518/QR-MENU.git
cd QR-MENU
npm ci
cp .env.example .env.local
# .env.local에 프로젝트의 publishable key를 입력합니다.
npm run dev
```

터미널에 출력된 Local 주소에서 메뉴판을 확인합니다. 기본 주소는 `http://localhost:5173/menu`입니다. 같은 네트워크의 휴대폰에서는 터미널의 Network 주소에 `/menu`를 붙여 접속할 수 있습니다.

`.env.local`에는 `VITE_SUPABASE_URL`과 `VITE_SUPABASE_PUBLISHABLE_KEY` 두 값이 필요합니다. Supabase 대시보드 **Connect → Framework**에서 프로젝트 URL과 `sb_publishable_…` 키를 확인합니다. 로컬 환경 파일은 Git에서 제외합니다. 환경 변수 변경 후 개발 서버를 다시 시작하세요. 설정이 없거나 조회에 실패하면 메뉴 오류·재시도 화면이 표시되며, 정적 샘플로 대체하지 않습니다.

| 명령              | 동작                            |
| ----------------- | ------------------------------- |
| `npm run dev`     | 개발 서버와 HMR                 |
| `npm test`        | 언어 선택·데이터 경계 테스트    |
| `npm run build`   | TypeScript 검사와 프로덕션 빌드 |
| `npm run preview` | 빌드한 `dist/` 확인             |

의존성은 `package-lock.json`으로 고정합니다. 파일 수정이 개발 화면에 반영되지 않는 환경에서는 `CHOKIDAR_USEPOLLING=true npm run dev`로 변경 감지를 켤 수 있습니다. 개발 서버의 포트가 사용 중이면 Vite가 출력하는 실제 주소를 확인하세요.

## 언어 동작

| 표기     | 코드      | 직접 열기            |
| -------- | --------- | -------------------- |
| 한국어   | `ko`      | `/menu?lang=ko`      |
| English  | `en`      | `/menu?lang=en`      |
| 简体中文 | `zh-Hans` | `/menu?lang=zh-Hans` |
| 繁體中文 | `zh-Hant` | `/menu?lang=zh-Hant` |

선택 순서는 **유효한 URL 언어 → 기기에 저장된 언어 → 브라우저 선호 언어 → 한국어**입니다. `zh-TW`·`zh-HK`·`zh-MO`는 번체, `zh-CN`·`zh-SG`·`zh`는 간체로 연결하며 명시된 `Hans`·`Hant` 스크립트가 지역보다 우선합니다.

언어 선택은 메뉴·상세·공통 문구·문서의 `lang` 속성·제목·URL에 함께 적용됩니다. 저장소를 사용할 수 없는 환경에서도 현재 화면의 언어 전환은 동작합니다. 언어를 바꿔도 가격은 동일한 KRW 금액입니다.

## 구조와 데이터 흐름

```text
src/
├── components/     메뉴 카드, 사진, 상세 모달, 언어 선택
├── data/
│   ├── restaurantMenu.ts    초기 데이터 스냅샷 (테스트·시드 참조)
│   ├── mapper.ts            DB 행 → 화면용 모델
│   ├── supabaseMenuRepository.ts  공개 Data API 조회
│   └── menuRepository.ts    API 조회 연결 지점
├── lib/supabase.ts  공개 메뉴용 Supabase 클라이언트
├── domain/menu.ts  데이터 모델과 MenuRepository 계약
├── hooks/          조회 상태, 언어, 모달 history
├── i18n/           네 언어 공통 문구와 코드 번역
├── App.tsx         손님 메뉴판 화면
└── styles.css      반응형 스타일

public/
├── images/         등록 메뉴 사진
├── photo-credits.html
└── photo-credits.json
```

```text
MenuRepository.getCatalog(signal)
  → Supabase Data API: categories / menu_items
  → mapCatalog()
  → MenuCatalog
  → useMenuCatalog()
  → 카드와 상세 모달
```

컴포넌트는 정적 메뉴 파일이나 Supabase SDK에 직접 접근하지 않습니다. 조회 계층이 두 테이블을 병렬로 읽고, `AbortSignal`을 두 요청에 전달합니다. 15초를 넘긴 조회는 중단하며, 한쪽 요청이 실패해도 전체 조회 실패로 처리합니다. SDK는 별도 청크로 불러오므로 메뉴 화면의 초기 로딩 상태를 먼저 렌더링할 수 있습니다.

`mapCatalog()`는 숨김 메뉴와 공개 메뉴가 없는 카테고리를 제외하고, 카테고리·메뉴 순서를 적용합니다. 품절 메뉴는 유지합니다. 카테고리 누락·잘못된 가격·필수 번역 누락은 빈 메뉴나 조용한 번역 대체로 처리하지 않고 조회 실패로 전달합니다. **클라이언트의 숨김 제외 처리는 서버 RLS를 대체하지 않습니다.**

## Supabase 조회

`src/data/menuRepository.ts`의 `menuRepository`가 `supabaseMenuRepository`를 사용합니다.

| 테이블 | 조회 조건 | 정렬 |
| --- | --- | --- |
| `categories` | RLS가 허용하는 카테고리 | `sort_order`, `id` |
| `menu_items` | `status in (available, sold_out)` + RLS | `sort_order`, `id` |

화면에 필요한 컬럼만 읽어 `mapCatalog()`에 전달합니다. 기존 `/images/restaurant/` 사진 경로와 사진 없는 메뉴의 `null`을 유지합니다. 메뉴 상세도 목록에서 받은 네 언어 설명·원산지·알레르기 정보를 사용하므로 추가 요청 없이 열립니다. `restaurantMenu.ts`는 런타임 조회나 장애 시 대체 데이터로 사용하지 않습니다.

현재 타입은 DB의 `name_ko`, `name_en`, `name_zh_hans`, `name_zh_hant`, 언어별 설명, 단일 정수 가격, 원산지 코드 목록, 알레르기 코드와 검수 상태를 반영합니다. `src/i18n/copy.ts`에는 초기 DB 마이그레이션의 재료·알레르기 코드 번역이 있습니다. 국가명은 `Intl.DisplayNames`로 표시합니다.

브라우저용 publishable key와 공개 조회 RLS를 사용합니다. 공개 클라이언트는 Auth 세션을 저장·복원하지 않아 관리자 로그인 세션이 있어도 손님 메뉴판에 사용하지 않습니다. [Supabase 공식 API 키 안내](https://supabase.com/docs/guides/getting-started/api-keys)에 따라 publishable key는 브라우저에 노출되는 값이며, 데이터 접근 범위는 RLS로 제한합니다. service role·secret key·DB 비밀번호는 브라우저 코드나 `VITE_` 환경 변수에 넣지 않습니다. DB 생성 SQL·초기 데이터·권한 검증 SQL은 `supabase/`에 보관하며, 메뉴판은 DB 조회만 수행합니다.

## 메뉴 수정하기

- 상호와 공통 문구: `src/i18n/copy.ts`
- 메뉴·가격·카테고리·품절 상태·번역: Supabase Table Editor의 `categories`, `menu_items`
- 사진: `public/images/`와 각 행의 `image_path`
- 색상·서체·여백: `src/styles.css`

`src/data/restaurantMenu.ts`를 수정하는 것만으로 운영 DB가 바뀌지는 않습니다. `supabase/seed.sql`도 기존 UUID를 덮어쓰지 않으므로 운영 정보 수정은 DB에서 수행합니다.

`available`은 판매 중, `sold_out`은 품절, `hidden`은 비공개입니다. `allergen_review_status: 'unreviewed'`와 빈 알레르기 목록은 서로 다른 의미입니다. 미확인 정보를 '없음'으로 바꾸거나 식단 적합성을 자동 판단하지 않습니다.

## Vercel 빌드 설정

- Framework: Vite
- Install: `npm ci`
- Build: `npm run build`
- Output: `dist`
- Environment Variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (로컬과 같은 프로젝트 값)

Vite는 환경 변수를 빌드 시점에 포함합니다. Vercel에 값을 추가·변경하면 해당 환경을 다시 배포해야 적용됩니다. 로컬 `.env.local` 파일은 Vercel로 전송하지 않습니다.

`vercel.json`이 `/menu` 직접 접속을 `index.html`로 연결합니다. 사진과 출처 페이지는 정적 파일로 제공됩니다. 이 README의 배포 설정은 저장소 설정 방법이며 실제 Vercel 배포 완료를 의미하지 않습니다.

## 검증

검증 환경은 Node.js 26.3.1과 Chromium 기반 브라우저입니다. 기존 화면은 320·390·768·1440px × 네 언어의 16개 조합에서 가로 넘침 없이 표시되는 것을 확인했습니다. API 연결 후 실제 공개 키로 카테고리 4개·메뉴 19개를 조회하고 네 언어·카테고리·상세·사진 동작을 확인했습니다. 실제 iPhone Safari·Android 실기기 검증은 수행하지 않았습니다.

`npm test`의 29개 테스트는 URL·저장값·브라우저 언어 우선순위, 중국어 스크립트 구분, 가격 표시, 숨김·품절 처리, 이미지 경로 변환, 잘못된 데이터 거부와 독립된 메뉴 사본을 검증합니다. API 테스트는 실제 SDK에 모의 HTTP 응답을 전달하여 공개 키·조회 조건, 양쪽 테이블의 오류, 빈 목록, 번역 누락, 요청 취소·시간 제한, 잘못된 키 설정을 확인합니다.

브라우저 검증은 실제 Supabase 조회 결과로 수행합니다. 단위 테스트는 외부 서비스에 연결하지 않습니다. 사진은 현재 프론트엔드의 정적 파일을 사용합니다.

## 사진 출처

네이버 주문에 등록된 메뉴 사진 7개와 네이버 플레이스에 연결된 배민 몸국 사진 1개를 사용합니다. 배포 서버의 상세 메뉴용 이미지 또는 원본 JPEG를 저장하고 화면 비율에 맞춰 표시합니다. 총 8개 파일은 약 591KiB이며, 사진이 없는 11개 메뉴는 준비 중 상태로 표시합니다. 사진별 등록 페이지·원본·처리 방식은 [사진 출처 정리](docs/PHOTO_CREDITS.md)와 [출처 데이터](public/photo-credits.json)에 기록했습니다. 방문자 리뷰 사진과 배민 공용 이미지 라이브러리는 사용하지 않습니다.
