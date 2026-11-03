# Zhengquan Sun — Academic Homepage

An English academic homepage for Zhengquan Sun (Beihang University & Zhongguancun Laboratory), with research interests, publications, paper links, BibTeX citations, and contact information.

## Edit content

Edit `profile.json`. No HTML changes are needed for routine content updates.

- `name`, `position`, `affiliation`, `email`: profile details. Empty optional fields are hidden.
- `about`: paragraphs of the research biography.
- `interests`: research interest labels.
- `portrait`: optional local image, e.g. `assets/img/portrait.jpg`; otherwise a typographic initial is shown.
- `links`: academic profile links, each with `label` and `url`. A CV can use `assets/files/cv.pdf`.
- `publications`: entries with `title`, `authors` (array), `venue`, `year`, `url`, `summary`, `links`, and optional `bibtex`. The author matching `name` is emphasized.
- `news`: optional entries with `date`, `text`, and optional `url`.
- `education`: optional entries with `period`, `institution`, `degree`, and optional `detail`.
- `service`: optional list of academic service descriptions.

No sample publications, fictional qualifications, or placeholder contact links are displayed. The MiuGS metadata comes from https://github.com/qjfysun/MiuGS.

## Preview locally

Requires Node.js 22+ and Python 3, with no package installation.

```sh
node scripts/build.mjs
python3 -m http.server 4173 --directory dist
```

Open http://localhost:4173. After changing content, rebuild and refresh.

## Publish to GitHub Pages

In repository **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**. Pushes to `main` run `.github/workflows/pages.yml`, build the static `dist/` folder, and publish it.

For the current repository name, the expected URL is https://qjfysun.github.io/szq.github.io/ (not `szq.github.io`). Relative asset links work at this project URL. No custom domain is configured.

The original Minimal Light theme files remain in the repository for reference, but are not included in the deployment artifact. The new page is generated solely from `profile.json`, `scripts/build.mjs`, and `assets/academic.*`; it does not load the original template's analytics, fonts, sample papers, or remote Jekyll theme.

## Design and accessibility

Responsive layout, system fonts, light/dark theme with saved preference, reduced-motion support, keyboard focus styles, skip navigation, print styles, and accessible citation controls. Biography and publication text remains readable without JavaScript. No tracking scripts or external CSS dependencies.

## License

Original template: [Minimal Light](https://github.com/yaoyao-liu/minimal-light), CC0; original `LICENSE` retained.
