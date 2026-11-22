// Experience, education, skills, and side builds shown on the home page.
// Every statement here comes from Henry's resume facts. Do not add numbers,
// names, or affiliations that he has not confirmed.

export interface ExperienceItem {
  role: string;
  org: string;
  detail?: string;
  period: string;
  points: { text: string; href?: string }[];
}

export const experience: ExperienceItem[] = [
  {
    role: 'GT-STAR Fellow and Undergraduate Research Assistant',
    org: 'METTL, Georgia Tech',
    detail: 'Microelectronics and Emerging Technologies Thermal Laboratory, Prof. Yogendra Joshi',
    period: 'Sep 2026 to present',
    points: [
      { text: 'GT-STAR is a TSMC and Georgia Tech partnership.' },
      { text: 'Research area: liquid cooling for high-heat-flux electronics.' },
      {
        text: 'Current lab work: cold plate geometry modeling for the ITherm 2027 student design competition.',
        href: '/projects/itherm-2027/',
      },
      { text: 'Attended ASHRAE and Georgia Tech thermal workshops associated with METTL.' },
    ],
  },
  {
    role: 'Co-founder',
    org: 'Orbital Initiative at Georgia Tech',
    period: 'Founded Sep 2026',
    points: [
      { text: 'First undergraduate small-satellite club at Georgia Tech.' },
      { text: 'Goal: a CubeSat in orbit.' },
      { text: 'Faculty sponsor: Dr. Lightsey.' },
    ],
  },
  {
    role: 'Chemistry Teaching Assistant',
    org: 'Georgia State University',
    period: 'Aug 2025 to May 2026',
    points: [{ text: 'Led 3-hour Principles of Chemistry I lab sections of about 30 students.' }],
  },
  {
    role: 'Band President and Logistics Lead',
    org: 'Cambridge High School Band',
    period: 'High school',
    points: [
      { text: 'Logistics lead for a 112-member marching band.' },
      { text: 'Founded an 80-member band fitness program.' },
    ],
  },
];

export const education = {
  school: 'Georgia Institute of Technology',
  degree: 'B.S. Mechanical Engineering',
  expected: 'Expected May 2029',
  transfer: 'Transferred from the Georgia State University Honors College.',
  affiliations: ['ASHRAE student member'],
};

export const focus = {
  primary:
    'Thermal-fluids: electronics and data center liquid cooling, cold plates, high heat flux.',
  open: 'Also open to aerospace and defense, manufacturing, and HVAC work.',
};

export const skills: { group: string; items: string[] }[] = [
  {
    group: 'Thermal analysis',
    items: ['Heat transfer', 'Thermal resistance analysis', 'Pressure drop', 'Uncertainty analysis'],
  },
  {
    group: 'Simulation',
    items: ['ANSYS Fluent', 'Conjugate heat transfer', 'COMSOL', 'OpenFOAM', 'Topology optimization'],
  },
  {
    group: 'CAD and fabrication',
    items: [
      'SOLIDWORKS',
      'Fusion 360',
      'FDM 3D printing (Bambu P1S)',
      'Design for AM',
      'Gasket and sealing design',
    ],
  },
  {
    group: 'Instrumentation',
    items: ['Arduino DAQ', 'Thermocouples', 'Flow and pressure sensors', 'Calibration'],
  },
  {
    group: 'Programming',
    items: ['Python', 'MATLAB'],
  },
];

export const sideBuilds: { title: string; text: string; tag: string }[] = [
  {
    title: 'Electric ducted-fan flying wing',
    text: 'SR-71 and B-2 inspired flying wing with an onboard thermal angle.',
    tag: 'Early stage',
  },
  {
    title: 'Dual RTX 3090 inference workstation',
    text: 'Local AI inference machine. Runs a 32B model at 8-bit with tensor parallelism across both cards.',
    tag: 'Personal build',
  },
];
