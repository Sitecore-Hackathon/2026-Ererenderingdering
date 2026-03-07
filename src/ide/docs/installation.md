# Installation

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- npm (included with Node.js)

## Local Setup

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd src/ide
npm install
```

### Development Mode

```bash
npm run dev
```

Opens the app at `http://localhost:3000` with hot-reload enabled.

### Production Build

```bash
npm run build
npm run start
```

Builds and serves the optimized production app at `http://localhost:3000`.

> **Note:** Both `npm run dev` and `npm run build` automatically generate help data via `predev` and `prebuild` scripts. No manual step is needed.

## Deploying to Production

The app is a standard Next.js application and can be deployed to any hosting platform that supports it.

### Netlify

1. Connect your repository to Netlify
2. Set the build command to `cd src/ide && npm install && npm run build`
3. Set the publish directory to `src/ide/.next`
4. Deploy

The Hackathon instance is hosted at: `https://sitecore-hackathon-2026.netlify.app/`

### Other Platforms

Any platform that supports Next.js (Vercel, Azure, AWS, etc.) will work. Refer to the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for platform-specific instructions.

## Next Steps

Once the app is running, you need to [register and configure it](./configuration) in the Sitecore Cloud Portal before it can connect to your Sitecore instance.
