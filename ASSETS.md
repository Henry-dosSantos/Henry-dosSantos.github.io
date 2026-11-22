# Asset checklist

Every figure the site is waiting for. Put each file at the path shown, commit, and push. The placeholder is replaced automatically.

- Formats: `.jpg`, `.png`, or `.webp`. Export iPhone HEIC photos as JPG first.
- Size: upload the original. Aim for at least 1600 px on the long side. The build resizes and compresses.
- Before uploading a photo, check the frame for anything that should not be public: other lab hardware, whiteboards, screens, badges.

All paths are relative to `src/assets/projects/`.

## Cold plate testbed

| File | What it should show |
| --- | --- |
| `cold-plate-testbed/cover.jpg` | Best single photo of the rig. Shown on the home page. |
| `cold-plate-testbed/testbed-overview.jpg` | Full testbed on the bench: reservoir, pump, flow sensor, cold plate on the heater block, radiator, DAQ. |
| `cold-plate-testbed/loop-diagram.png` | Loop diagram with component order and the location of each thermocouple, the flow sensor, and the pressure taps. |
| `cold-plate-testbed/cold-plate-assembly.jpg` | Photo or CAD render of the assembly: copper base, ASA channel body, gasket, G1/4 bulkheads. |
| `cold-plate-testbed/rth-vs-power.png` | Thermal resistance vs. heater power for the straight-channel baseline, with uncertainty bars. |
| `cold-plate-testbed/cfd-temperature.png` | Temperature contours from the Fluent half-symmetry CHT model. |

Also needed for the write-up text (send these as text and they get added to the page):

- Thermal resistance at each of the four power levels.
- The thermal resistance definition (which temperatures) and where each thermocouple sits.
- Mesh image, and the CFD vs. measured thermal resistance comparison.

Raw logs, analysis scripts, CAD, firmware, and CFD files go in the `cold-plate-testbed` repository, not here. That repository's README lists where each belongs.

## ITherm 2027

Nothing before the Jan 4, 2027 submission and team approval. After that:

| File | What it should show |
| --- | --- |
| `itherm-2027/cover.jpg` | Home page image. |
| `itherm-2027/design.png` | Cold plate design visuals. |
| `itherm-2027/cfd-results.png` | CFD temperature and pressure fields against the competition limits. |
| `itherm-2027/prototype.jpg` | Machined prototype. |
| `itherm-2027/test-data.png` | Measured temperature and pressure drop. |

When these go up, also remove the `hold` line from each `<Figure>` in `src/content/projects/itherm-2027.mdx` and delete the "Publication hold" callout.

## Cold plate optimizer

| File | What it should show |
| --- | --- |
| `cold-plate-optimizer/cover.png` | Home page image. |
| `cold-plate-optimizer/ui.png` | Screenshot of the application. |
| `cold-plate-optimizer/geometries.png` | Example generated geometries. |
| `cold-plate-optimizer/pareto.png` | Example Pareto front with the three selected designs marked. |

Only use output the tool has actually produced.

## 3D-printed hardware

| File | What it should show |
| --- | --- |
| `printed-hardware/cover.jpg` | Home page image. |
| `printed-hardware/wrench-kits.jpg` | The PETG music stand wrench kits. |
| `printed-hardware/rack.jpg` | The second rack layer installed at Cherith Farms, connectors visible. |
| `printed-hardware/rack-beam-analysis.png` | Scan or clean copy of the hand beam analysis. |
| `printed-hardware/mouthpiece-visualizers.jpg` | The brass mouthpiece visualizers. |

## Site-wide

| File | Notes |
| --- | --- |
| `public/Henry-dos-Santos-Resume.pdf` | One page, no phone number. Then set `resume: true` in `src/site.config.mjs`. |
