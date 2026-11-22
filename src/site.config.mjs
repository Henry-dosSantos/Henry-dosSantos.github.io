// Single source of truth for identity and links. Edit here; every page reads from it.

// Your GitHub username. The site URL and repository links derive from it.
export const githubUser = 'Henry-dosSantos';

export const site = {
  name: 'Henry dos Santos',
  url: `https://${githubUser.toLowerCase()}.github.io`,
  title: 'Henry dos Santos | Thermal-Fluids Engineering',
  description:
    'Mechanical engineering student at Georgia Tech. Liquid cooling for high-heat-flux electronics: cold plate design, conjugate heat transfer CFD, and instrumented test loops.',
  email: 'henryrdossantos@gmail.com',
  linkedin: 'https://www.linkedin.com/in/henry-dossantos',
  github: `https://github.com/${githubUser}`,

  // Georgia Tech GPA. Leave null until final grades post and you confirm the value.
  // While null, the site shows "pending". Set to a string to publish it.
  gpa: null,

  // Set to true after adding public/Henry-dos-Santos-Resume.pdf (no phone number in the PDF).
  resume: false,
};

// Accepts a repository name under the account above, or a full URL.
export const repoUrl = (repo) =>
  !repo ? null : repo.startsWith('http') ? repo : `${site.github}/${repo}`;
