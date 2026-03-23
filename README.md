# VLUU

VLUU는 사진을 한 장씩 소비하기보다, 몇 장이 이어질 때 생기는 흐름을 보여주는 개인 갤러리 사이트입니다.

## 라이브 사이트

- [vluu-gallery.vercel.app](https://vluu-gallery.vercel.app)

## 프로젝트 소개

- 공개 사이트는 `Next.js`로 구성했습니다.
- 사진 업로드와 내부 큐레이션은 `Sanity Studio`에서 관리합니다.
- 배포와 운영은 `Vercel`을 기준으로 합니다.

## 프로젝트 구조

- `apps/web`: 공개 갤러리 사이트
- `apps/studio`: 사진과 내부 큐레이션을 관리하는 Sanity Studio
- `docs`: 배포, 디자인 시스템, 운영 메모

## 주요 스크립트

```bash
pnpm dev:web
pnpm dev:studio
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
```

## 로컬 실행

1. 루트에서 의존성을 설치합니다.

```bash
pnpm install
```

2. [`.env.example`](./.env.example)을 참고해 `.env.local`을 준비합니다.
3. 필요한 앱을 실행합니다.

```bash
pnpm dev:web
pnpm dev:studio
```

## 환경 변수와 배포

- Preview와 Production 환경 변수는 Vercel에서 각각 따로 관리합니다.
- 배포와 운영 흐름은 [`docs/deployment.md`](./docs/deployment.md)에 정리되어 있습니다.
