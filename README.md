# VLUU

VLUU는 사진을 시퀀스로 엮어 보여주는 개인 갤러리 사이트입니다.

## 라이브 사이트

- [vluu-gallery.vercel.app](https://vluu-gallery.vercel.app)

## 소개

한 장씩 보는 사진보다, 사진들이 이어질 때 생기는 흐름에 더 집중한 사이트입니다.
공개 사이트는 Next.js로 만들었고, 사진과 순서 관리는 Sanity Studio에서, 배포는 Vercel에서 운영합니다.

## 프로젝트 구조

- `apps/web`: 공개 갤러리 사이트
- `apps/studio`: 사진과 내부 큐레이션을 관리하는 Sanity Studio

## 주요 스크립트

```bash
pnpm dev:web
pnpm dev:studio
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
```

## 실행 및 환경 설정

[`.env.example`](./.env.example)을 바탕으로 `.env.local`을 만든 뒤 실행합니다.

Preview와 Production 환경 변수는 Vercel에서 각각 따로 관리합니다.
배포와 운영에 관한 자세한 내용은 [`docs/deployment.md`](./docs/deployment.md)에서 확인할 수 있습니다.
