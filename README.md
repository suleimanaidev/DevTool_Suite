# DevTools Suite

Ten everyday tools on one website. Everything runs in the browser, so there is no backend and no database.

| Tool | Route |
|------|-------|
| Typing Speed Test | `/typing-test` |
| Markdown Previewer + Bold/Italic Text Styler | `/markdown` |
| Invoice Generator | `/invoice` |
| Stopwatch | `/stopwatch` |
| Word Counter | `/word-counter` |
| Countdown Timer | `/countdown` |
| Calculator | `/calculator` |
| Image Metadata Viewer | `/image-metadata` |
| CSV to JSON Converter | `/csv-to-json` |
| QR Code Generator | `/qr-code` |

**Stack:** Next.js 15 (App Router, JavaScript) + plain CSS + framer-motion (animations) + exifr (image metadata) + qrcode (QR codes).

```
/frontend   Next.js app
```

## Run it

```bash
cd frontend
copy .env.local.example .env.local     # Mac/Linux: cp .env.local.example .env.local
npm install
npm run dev
```

Open http://localhost:3000. Production build: `npm run build` (writes the static site to `out/`). Preview it locally with `npm run preview`.

`NEXT_PUBLIC_SITE_URL` (in `.env.local`) is your public website address. It is used for SEO (canonical links, sitemap, social previews). Set it to your real domain when you deploy.

## Deploy to Cloudflare Pages

The site is fully static (`output: "export"` in `next.config.mjs`), so it runs on Cloudflare Pages with no server.

1. Set `NEXT_PUBLIC_SITE_URL` in `.env.local` to the final URL, for example `https://devtoolssuite.pages.dev`.
2. Run `npm run build`.
3. Deploy the `out/` folder:

```bash
npx wrangler pages deploy out --project-name devtoolssuite
```

The project is connected to GitHub (`suleimanaidev/DevTool_Suite`, branch `main`), so pushes to `main` deploy automatically. The manual command above can still be used for an ad-hoc direct-upload deploy. `public/_headers` sets the correct content type for the social preview image and long-term caching for built assets.

## Notes

- The landing page is at `/`; the tools use a left sidebar.
- Theme: red (#D72638) and cream (#FFF3E0).
- Invoice "Download PDF" uses `window.print()`; choose **Save as PDF** in the print dialog. Print CSS hides everything except the A4 invoice.
- Typing records, custom paragraphs, Markdown text, invoice data, word counter drafts, countdown settings and calculator history are saved in your browser's `localStorage`.
- The stopwatch and countdown timer use short Web Audio sound effects, so no audio files are needed.
- Image metadata is read with `exifr`; QR codes are generated with `qrcode`. Both run entirely in the browser.
- SEO / AEO / GEO: per-page metadata, FAQ and how-to structured data (JSON-LD), `/sitemap.xml`, `/robots.txt` (AI crawlers allowed) and `/llms.txt`. The content lives in `frontend/lib/seo.js`.