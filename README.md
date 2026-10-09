# Hellen Zulu – Portfolio

A static personal website built with plain HTML, CSS and JavaScript. There is no build step and nothing to install.

```
index.html          the whole site (single page)
404.html            not-found page
css/styles.css      design tokens, layout, dark/light themes
js/main.js          theme toggle, mobile menu, hero animation, contact form
assets/favicon.svg  site icon
vercel.json         Vercel config (security headers, caching)
netlify.toml        Netlify config
robots.txt
```

## Preview locally

```bash
cd hellen-zulu-portfolio
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy

**Vercel**
1. Push this folder to a GitHub repository.
2. On vercel.com choose *Add New → Project*, import the repo.
3. Framework preset: *Other*. Leave build command and output directory empty. Deploy.

**Netlify**
Drag the whole folder onto https://app.netlify.com/drop, or connect the repo. No build command; publish directory is `.`.

**GitHub Pages**
Push to a repo, then *Settings → Pages → Deploy from a branch → main / (root)*. The `.nojekyll` file is already included. If the site is served from `/repo-name/`, change the two absolute paths in `404.html` (`/assets/...` and `/`) to relative ones.

## After you deploy

- Once you have your final URL, add to the `<head>` of `index.html`:
  `<link rel="canonical" href="https://YOUR-DOMAIN/">` and `<meta property="og:url" content="https://YOUR-DOMAIN/">`.
  For a rich preview image when the link is shared, also add an `og:image` (a 1200×630 PNG at an absolute URL).
- Add your LinkedIn: put a link in the Contact section of `index.html` and add the URL to the `sameAs` list in the JSON-LD block.
- Add a CV download: put a PDF in `assets/` and link to it from the hero. Use a version without your references' phone numbers, since the site is public.
- Add links to the Derma AI Assistant repo or demo in the project card once they are public.

## Editing content

All text lives in `index.html`, one `<section>` per part of the page. Colours, fonts and spacing are CSS variables at the top of `css/styles.css`.

## Contact form

The site has no backend. The form builds an email in the visitor's mail app (`mailto:`). If you want messages delivered without that step, point the form at a form service such as Formspree or Netlify Forms and remove the submit handler at the bottom of `js/main.js`.
