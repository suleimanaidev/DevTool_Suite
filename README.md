# DevTools Suite

Eleven everyday tools on one website. Everything runs in the browser, so there is no backend and no database.

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
| Color Palette Extractor | `/color-palette` |
| CSV to JSON Converter | `/csv-to-json` |
| QR Code Generator | `/qr-code` |

**Stack:** Next.js 15 (App Router, JavaScript) + plain CSS + framer-motion (animations).

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

Open http://localhost:3000. Production check: `npm run build && npm start`.

`NEXT_PUBLIC_SITE_URL` (in `.env.local`) is your public website address. It is used for SEO (canonical links, sitemap, social previews). Set it to your real domain when you deploy.

## Notes

- The landing page is at `/`; the tools use a left sidebar.
- Theme: red (#D72638) and cream (#FFF3E0).
- Invoice "Download PDF" uses `window.print()`; choose **Save as PDF** in the print dialog. Print CSS hides everything except the A4 invoice.
- Typing records, custom paragraphs, Markdown text, invoice data, word counter drafts, countdown settings and calculator history are saved in your browser's `localStorage`.
- The stopwatch and countdown timer use short Web Audio sound effects, so no audio files are needed.
- Image metadata is read with `exifr`; QR codes are generated with `qrcode`. Both run entirely in the browser.
- SEO / AEO / GEO: per-page metadata, FAQ and how-to structured data (JSON-LD), `/sitemap.xml`, `/robots.txt` (AI crawlers allowed) and `/llms.txt`. The content lives in `frontend/lib/seo.js`.