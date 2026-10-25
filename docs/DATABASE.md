# 데이터베이스

2026-10-25에 Supabase `QR-MENU` 프로젝트(`pfjcitkxemojspgetumm`)의 SQL Editor에서 스키마와 초기 데이터를 적용했습니다. 프론트엔드는 계속 정적 데이터를 사용합니다. DB 생성과 프론트엔드 연결은 별개입니다.

## 구조

| 테이블 | 역할 | 초기 데이터 |
| --- | --- | --- |
| `public.categories` | 네 언어 카테고리명, 정렬 순서 | 4개 |
| `public.menu_items` | 메뉴명·설명·가격·사진 경로·판매 상태·원산지·알레르기 | 19개 |

`menu_items.category_id`가 `categories.id`를 참조합니다. 메뉴가 남아 있는 카테고리는 삭제할 수 없습니다. 메뉴 가격은 원화 정수 한 개이며 0 이상입니다. 두 테이블 모두 UUID, 정렬 순서, 생성·수정 시각, `version`을 가집니다.

카테고리 이름은 한국어·영어·중국어 간체·중국어 번체를 모두 입력합니다. 메뉴는 `hidden` 상태로 번역이 불완전한 초안을 저장할 수 있고, `available` 또는 `sold_out`으로 공개하려면 네 언어 이름과 설명이 모두 있어야 합니다. 품절 메뉴도 손님에게 보입니다.

원산지는 재료 코드와 국가 코드 목록으로 검증합니다. 지역별 원산지 표현은 설명에 보존합니다. 알레르기 코드와 검수 상태는 별도 필드입니다. 초기 메뉴의 알레르기는 모두 `unreviewed`이며, 빈 코드 목록을 알레르기 없음으로 해석하지 않습니다.

사진 8개의 `image_path`는 현재 프론트엔드의 `/images/restaurant/…` 정적 경로입니다. 사진 없는 메뉴 11개는 `null`입니다. 이번 구성에서는 Storage 버킷을 만들지 않았습니다.

## 로그인과 권한

영구 Supabase Auth 계정은 모두 관리자입니다. 별도 `admins` 테이블은 만들지 않습니다. Auth의 **Allow new users to sign up**과 **Allow anonymous sign-ins**는 껐으며, 이메일 확인은 유지합니다. 관리자 계정은 Supabase 대시보드에서 관리합니다. 현재 앱 Auth 계정은 0개이며, 대시보드 로그인 계정이 자동으로 앱 계정이 되지는 않습니다.

두 테이블에 RLS를 적용하고 기본 권한을 회수한 뒤 필요한 권한만 부여했습니다.

| 접속 | 조회 | 등록·수정·삭제 |
| --- | --- | --- |
| 비로그인 손님 (`anon`) | 카테고리, 판매 중·품절 메뉴 | 불가 |
| 영구 Auth 계정 (`authenticated`) | 숨김 메뉴 포함 전체 | 가능 |
| 익명 Auth 세션 | 공개 메뉴만 | 불가 |

클라이언트는 `version`, 생성·수정 시각을 직접 바꿀 수 없습니다. UPDATE 트리거가 수정 시각과 `version`을 갱신합니다. 관리자 수정 API는 `id`와 읽어 온 `version`을 함께 조건에 넣고, 갱신 행이 0개면 충돌로 처리합니다.

```ts
// 관리자 조회로 얻은 기존 version을 조건에 포함합니다.
supabase.from('menu_items')
  .update({ price: 11000 })
  .eq('id', menuId)
  .eq('version', previousVersion)
  .select('id, version')
```

브라우저에는 publishable key만 사용합니다. service role·secret key·DB 비밀번호를 프론트엔드에 넣지 않습니다. 공개 회원가입을 켜면 새 영구 계정도 관리자가 되므로 이 권한 모델에서는 계속 꺼 둡니다.

## SQL 파일과 적용 순서

1. Supabase Auth에서 공개 회원가입과 익명 로그인을 끕니다.
2. 빈 DB에 `supabase/migrations/20261025000100_create_menu_schema.sql`을 실행합니다.
3. `supabase/seed.sql`을 실행합니다.
4. `supabase/tests/menu_permissions.sql`을 postgres 권한으로 실행합니다.

스키마 파일은 빈 DB용입니다. 이미 존재하는 테이블을 지우거나 교체하지 않으며, 같은 객체가 있으면 트랜잭션이 실패합니다. 운영 DB에 중복 실행하지 않습니다. 시드 파일은 동일 UUID가 있으면 건너뛰므로 기존 메뉴를 덮어쓰지 않습니다. 실제 매장 데이터 출처는 [자료 기록](RESTAURANT_DATA.md)을 따릅니다.

SQL Editor에서 적용했으므로 CLI migration history에 자동 등록되지는 않습니다. 향후 CLI를 연결할 때 실제 스키마와 로컬 migration을 대조한 뒤 적용 이력을 맞춰야 합니다.

검증 SQL은 초기 시드 19개를 기준으로 손님 읽기와 쓰기 차단, 관리자 CRUD, 숨김 접근, 익명 Auth 쓰기 차단, 입력 제약, 버전 자동 증가를 검사합니다. 테스트의 행 변경은 하나의 트랜잭션에서 모두 롤백합니다. 2026-10-25 실제 프로젝트에서 `PASS` 결과를 확인했습니다. `supabase/tests/catalog_summary.sql`은 행 개수·사진·검수 상태·RLS·테스트 잔여 행을 읽기 전용으로 확인합니다. 운영 메뉴 수가 바뀌면 이 초기 데이터 검증의 개수 조건도 함께 조정합니다.
