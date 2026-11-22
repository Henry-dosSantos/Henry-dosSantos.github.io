# Portfolio site

Source for Henry dos Santos's portfolio at https://henry-dossantos.github.io.

Static site built with [Astro](https://astro.build). Every push to `main` builds and deploys through GitHub Actions (`.github/workflows/deploy.yml`). There is nothing to run by hand.

## Where things live

| To change | Edit |
| --- | --- |
| Name, email, links, GPA, resume button | `src/site.config.mjs` |
| Experience, education, skills, side builds | `src/data/profile.ts` |
| A project page and its home page card | `src/content/projects/<project>.mdx` |
| Photos, plots, renders | `src/assets/projects/<project>/` (see `ASSETS.md`) |
| Colors, type, motion | `src/styles/global.css` |
| Home page layout | `src/pages/index.astro` |

## Add a project

1. Copy an existing file in `src/content/projects/` and rename it. The file name becomes the URL: `my-project.mdx` is served at `/projects/my-project/`.
2. Edit the block between the `---` lines at the top: `title`, `shortTitle`, `summary`, `status` (`active`, `progress`, `dev`, or `complete`), `statusLabel`, `order` (lower shows first), `context`, `period`, `tools`, and `metrics`.
3. Write the body in Markdown under it. `## Heading` lines become the page sections and the "On this page" list.
4. Commit and push. The card on the home page and the project page are both generated from that one file.

Three building blocks are available in the body without any import:

```mdx
<Figure src="my-project/bench-photo" alt="What the image shows" caption="Optional caption." />

<Callout type="limit" title="Open items">
  - Something not yet tested.
</Callout>

<Finding n="01" title="Short statement of what you found">
  One or two sentences on what the data showed and what you did about it.
</Finding>
```

## Add a photo or plot

Drop the file into `src/assets/projects/<project>/` with the name the figure expects, then push. `<Figure src="my-project/bench-photo" />` looks for `src/assets/projects/my-project/bench-photo.jpg` (or `.png`, `.webp`). Until the file exists the page shows a labeled "pending" frame. Images are resized and compressed at build time, so upload the full-resolution original.

A file named `cover.jpg` in a project folder becomes that project's image on the home page card.

`ASSETS.md` lists every file the site is currently waiting for.

## Publish the GPA or the resume

In `src/site.config.mjs`:

- `gpa`: stays `null` until final grades post. Set it to a string to publish it.
- `resume`: add `public/Henry-dos-Santos-Resume.pdf` first, then set this to `true`. Check that the PDF has no phone number.

## Run it locally (optional)

Requires Node 22.23.4 or newer.

```sh
npm install
npm run dev      # live preview at http://localhost:4321
npm run build    # production build into dist/
npm run check    # type and template check
```

In `npm run dev`, each pending figure also prints the exact file path it is waiting for.

## Content rules

- No invented data, results, metrics, awards, or affiliations. Missing information gets a labeled placeholder.
- ITherm 2027: nothing beyond the problem statement, constraints, role, and tools until after the Jan 4, 2027 submission and team approval.
- No unpublished METTL lab data. No coursework or homework solutions. No phone number.

## Credits

Fonts: [Archivo](https://github.com/Omnibus-Type/Archivo) and [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono), both under the SIL Open Font License (license texts in `src/assets/fonts/`). Colors follow the Georgia Tech core palette. This is a personal site, not an official Georgia Tech publication.
