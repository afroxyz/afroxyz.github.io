# Chika Nwakanma — portfolio

Live website: https://afroxyz.github.io/

A dependency-free HTML, CSS and JavaScript portfolio, hosted by GitHub Pages from the main branch.

## Structure

- Content design: Kadet Wallet; Beela.
- Form design: Garden waste collections; SEND education preferences.
- AI content design: AI Content Design OS; Content Operations Agent; Data Analysis Agent.
- Conversational design: Feedback Analyser; 3G Lodges: Mara; Nomi Pay.

The existing eight case-study narratives and original images are preserved. The two form-design studies are portfolio reconstructions, clearly labelled on their pages; their prototypes do not submit data or take payment.

## Run locally

Run `python3 -m http.server 8000` in this directory and open http://localhost:8000. There is no build step.

## Editing

`index.html` contains the grouped homepage. `styles.css` retains the original design tokens; `experience.css` extends the paper, terracotta and pastel palette and provides the responsive layout. `portfolio.js` provides progressive enhancement: search, theme selection, mobile navigation, response comparison, case-study navigation, enlarged images and the form prototypes. Case-study content and links remain usable without JavaScript.

## Media

The 24-second silent video is an edited tour of existing portfolio artefacts, not a live product recording. It includes an English WebVTT caption track, poster and text transcript. To regenerate it, install Pillow and ffmpeg, then run `python3 tools/make-portfolio-tour.py`. Font paths in that script may need adjusting outside Linux.

Project images come from the existing repository. The visual direction takes inspiration from the supplied Precious Okoro FastTrackUX case-study page; no text, photographs or media from that page are used.

## Accessibility and privacy

Semantic headings and navigation, keyboard controls, visible focus, native video controls, a skip link, accessible validation and reduced-motion support are included. The site has no analytics or API-backed chatbot. Theme preference is stored locally. Fonts are requested from Google Fonts. Interactive examples are deterministic and do not send form inputs to a server.

## Validation for this update

Checked local links and assets, one H1 per page, duplicate IDs, removal of placeholder contact links, JavaScript syntax, original narrative preservation, 320px and 390px phone layout widths, project search, conversation comparison, native video playback and captions, image enlargement, and both form prototypes.
