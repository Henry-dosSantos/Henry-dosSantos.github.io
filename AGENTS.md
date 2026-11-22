# Portfolio site

Astro static site deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Commands

- `npm run dev`: local preview at http://localhost:4321
- `npm run build`: production build into `dist/`
- `npm run check`: Astro and TypeScript diagnostics. Run before pushing.

## Structure

- `src/site.config.mjs`: identity, links, GPA and resume switches.
- `src/data/profile.ts`: experience, education, skills, side builds.
- `src/content/projects/*.mdx`: one file per project. Generates the home page card and the project page. Schema in `src/content.config.ts`.
- `src/assets/projects/<id>/`: figures, looked up by file name by `<Figure>`. Missing files render a labeled placeholder. `ASSETS.md` lists what is outstanding.
- `src/components/`: `Figure`, `Callout`, and `Finding` are available in every project file without an import.

## Content rules

- Never invent data, results, metrics, awards, or affiliations. Use a labeled placeholder for anything missing.
- ITherm 2027: nothing beyond problem, constraints, role, approach, and tools until after the Jan 4, 2027 submission and team approval.
- No unpublished METTL lab data, no coursework solutions, no phone number.
- `gpa` in `src/site.config.mjs` stays `null` until Henry confirms the value in writing. Do not write the value anywhere else in the repository.
- Direct, technical voice. Keep in-progress work labeled as in progress.

## Conventions

- Styling is plain CSS with custom properties in `src/styles/global.css`. No CSS framework.
- Motion must respect `prefers-reduced-motion`. Page transitions use native cross-document view transitions, not a client router.
- Dependencies are pinned to exact versions at least 7 days old.
