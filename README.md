This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load the Geist and JetBrains Mono fonts.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy with Docker

The app is shipped as a Docker image published to GitHub Container Registry (GHCR).

On every merge to `main`, GitHub Actions runs lint, type-check and tests, then builds and pushes the image to `ghcr.io/kantomiarintsoa/uptimewatch`.

Run it locally:

```bash
docker build -t uptime-watch .
docker run -p 3000:3000 uptime-watch
```

Run it on a server (VPS):

```bash
docker pull ghcr.io/kantomiarintsoa/uptimewatch:latest
docker run -d --name uptime-watch -p 3000:3000 --restart unless-stopped \
  ghcr.io/kantomiarintsoa/uptimewatch:latest
```

To update, pull the new image, remove the container (`docker rm -f uptime-watch`) and run it again.
