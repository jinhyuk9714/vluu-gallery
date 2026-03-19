# VLUU

VLUU는 사진을 큐레이션해 공개하는 개인 갤러리 사이트입니다.

## 라이브 사이트

- [vluu-gallery.vercel.app](https://vluu-gallery.vercel.app)

## 프로젝트 소개

VLUU는 컬렉션 중심으로 사진을 보여주는 공개형 개인 갤러리입니다.

공개 사이트는 Next.js로 구성했고, 사진과 컬렉션 관리는 Sanity Studio에서, 배포는 Vercel에서 운영합니다.

## 프로젝트 구조

- `apps/web`: 공개 갤러리 사이트
- `apps/studio`: 사진과 컬렉션을 관리하는 Sanity Studio

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

웹 앱은 [`.env.example`](./.env.example)을 바탕으로 `.env.local`을 만들어 실행합니다.

Preview와 Production 환경 변수는 Vercel에서 각각 별도로 관리합니다. 배포와 운영에 관한 자세한 내용은 [`docs/deployment.md`](./docs/deployment.md)에서 확인할 수 있습니다.
