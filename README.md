# Chika Nwakanma — portfolio

Live website: https://afroxyz.github.io/

A dependency-free HTML, CSS and JavaScript portfolio, hosted by GitHub Pages from the main branch.

## Structure

Navigation follows **Work → discipline → case study**. The Form Design overview remains public. Its five full case studies and supporting images are served from a separate host with server-side password checks; the original GitHub Pages study URLs are access redirects. `work.html` introduces the four disciplines with short summaries. Each discipline has its own page and project list; every case study retains its own URL.

- Content design: DHP & Council Tax Hardship Fund; Kadet Wallet; Beela.
- Form design: DHP & Council Tax Hardship Fund; Medical Priority Assessment; Form Design Compiler; Garden waste collections; SEND education preferences.
- AI content design: Form Design Compiler; AI Content Design OS; Content Operations Agent; Data Analysis Agent.
- Conversational design: Feedback Analyser; 3G Lodges: Mara; Nomi Pay.

The existing eight case-study narratives and original images are preserved. The two form-design studies are portfolio reconstructions, clearly labelled on their pages; their prototypes do not submit data or take payment.

## Run locally

Run `python3 -m http.server 8000` in this directory and open http://localhost:8000. There is no build step.

## Editing

`index.html` is the homepage. `work.html` is the discipline directory. `content-design.html`, `form-design.html`, `ai-content-design.html` and `conversational-design.html` list the relevant projects. Edit each page’s cards when adding a project, and link its case study back to the relevant discipline. Never run old scratch generation scripts over these authored pages. `styles.css` retains the original design tokens; `experience.css` extends the paper, terracotta and pastel palette and provides the responsive layout. `portfolio.js` provides progressive enhancement: search, theme selection, mobile navigation, response comparison, case-study navigation, enlarged images and the form prototypes. Case-study content and links remain usable without JavaScript.

## Media

The 24-second silent video is an edited tour of existing portfolio artefacts, not a live product recording. It includes an English WebVTT caption track, poster and text transcript. To regenerate it, install Pillow and ffmpeg, then run `python3 tools/make-portfolio-tour.py`. Font paths in that script may need adjusting outside Linux.

Project images come from the existing repository. The visual direction takes inspiration from the supplied Precious Okoro FastTrackUX case-study page; no text, photographs or media from that page are used.

## Accessibility and privacy

Semantic headings and navigation, keyboard controls, visible focus, native video controls, a skip link, accessible validation and reduced-motion support are included. The site has no analytics or API-backed chatbot. Theme preference is stored locally. Fonts are requested from Google Fonts. Interactive examples are deterministic and do not send form inputs to a server.

## Validation for this update

Checked local links and assets, one H1 per page, duplicate IDs, removal of placeholder contact links, JavaScript syntax, original narrative preservation, 320px and 390px phone layout widths, project search, conversation comparison, native video playback and captions, image enlargement, and both form prototypes.

## Source-backed additions — 2 November 2026

Three new unique case studies bring the portfolio to 13. Financial support and the compiler are cross-listed in relevant disciplines and use a single canonical project page each. DHP uses the supplied ten-week Miro review; Medical Priority distinguishes documented design from unmeasured outcomes; the compiler distinguishes development controls from benchmarked reliability. See `evidence/source-notes.md` for claim scope and media provenance.
