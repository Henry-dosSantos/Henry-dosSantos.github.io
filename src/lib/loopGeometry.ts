// Shared geometry for the hero test-loop figure. Plate coordinates are in millimetres with the origin at
// the plate's top-left corner; everything else is in SVG viewBox units. The drawing is a schematic.

export const MM = 3.2;
export const OX = 120;
export const OY = 160;

export const px = (x: number) => OX + MM * x;
export const py = (y: number) => OY + MM * y;

export type GeoId = 'straight' | 'serpentine' | 'dense' | 'pin';
export const GEO_IDS: GeoId[] = ['straight', 'serpentine', 'dense', 'pin'];

export const GEO_LABELS: Record<GeoId, string> = {
  straight: 'Straight',
  serpentine: 'Serpentine',
  dense: 'High-density',
  pin: 'Pin-fin',
};

export const LEGEND: Record<GeoId, { channels: string; flow: string }> = {
  straight: {
    channels: '9 &times; (3 &times; 5 mm), D<sub>h</sub> = 3.75 mm. Tested (baseline).',
    flow: '&asymp; 840 mL/min, Re &asymp; 400 to 420, laminar',
  },
  serpentine: { channels: 'Serpentine. Designed, not yet tested.', flow: 'Not yet tested' },
  dense: { channels: 'High-density multi-channel. Designed, not yet tested.', flow: 'Not yet tested' },
  pin: { channels: 'Pin-fin. Designed, not yet tested.', flow: 'Not yet tested' },
};

export const PLATE = { w: 150, h: 100, r: 1.5 };
export const INNER = { x: 5, y: 15, w: 140, h: 70 };
export const BOLTS: [number, number][] = [10.4, 53.5, 96.5, 139.6].flatMap((x) => [
  [x, 8] as [number, number],
  [x, 92] as [number, number],
]);
export const BOLT_R = 1.6;

export const PLENUM_IN = { x: 13, y: 25, w: 29, h: 50, r: 1 };
export const PLENUM_OUT = { x: 108, y: 25, w: 29, h: 50, r: 1 };
export const PORT_IN = { x: 27.5, y: 50 };
export const PORT_OUT = { x: 122.5, y: 50 };
export const PORT_R = 8.5;
export const HOLE_IN = { x: 22, y: 32 };
export const HOLE_OUT = { x: 128, y: 32 };
export const HOLE_R = 1.6;
export const ZONE = { x0: 42, x1: 108, y0: 27, y1: 73 };
export const HEAT = { x: 55, y: 30, w: 40, h: 40 };

export const STRAIGHT_CH = Array.from({ length: 9 }, (_, k) => ({
  y: 27 + 5.375 * k,
  h: 3,
  cy: 28.5 + 5.375 * k,
}));
export const DENSE_CH = Array.from({ length: 13 }, (_, k) => ({
  y: 27 + (11 / 3) * k,
  h: 2,
  cy: 28 + (11 / 3) * k,
}));
export const CH_X = { x: 41.5, w: 67 };

export const SERP_D =
  'M 41.5 67.5 H 45.25 A 5 5 0 0 0 50.25 62.5 V 38.25 A 8.25 8.25 0 0 1 66.75 38.25 V 61.75 A 8.25 8.25 0 0 0 83.25 61.75 V 38.25 A 8.25 8.25 0 0 1 99.75 38.25 V 62.5 A 5 5 0 0 0 104.75 67.5 H 108.5';
export const SERP_W = 5;

export const PIN_R = 2.5;
export const PINS: [number, number][] = [];
for (let j = 0; j < 10; j++) {
  const x = 45.5 + 6.3 * j;
  if (j % 2 === 1) for (let m = 0; m < 7; m++) PINS.push([x, 50 + 7.1 * (m - 3)]);
  else for (let m = 0; m < 6; m++) PINS.push([x, 50 + 7.1 * (m - 2.5)]);
}

export const TUBE_D =
  'M 539 320 H 646 A 14 14 0 0 0 660 306 V 84 A 14 14 0 0 0 646 70 H 74 A 14 14 0 0 0 60 84 V 306 A 14 14 0 0 0 74 320 H 181';
export const TUBE_W = 9;
export const TUBE_BORE = 6.5;

export const RAD = { x: 560, y: 70, w: 76, h: 48, fins: 7 };
export const RES = { x: 400, y: 70, w: 60, h: 48 };
export const PUMP = { x: 250, y: 70, r: 22 };
export const SENSOR = { x: 132, y: 70, r: 18 };

export type Seg =
  | { k: 'L'; x0: number; y0: number; x1: number; y1: number }
  | { k: 'A'; cx: number; cy: number; r: number; a0: number; a1: number };

const L = (x0: number, y0: number, x1: number, y1: number): Seg => ({ k: 'L', x0, y0, x1, y1 });
const A = (cx: number, cy: number, r: number, a0: number, a1: number): Seg => ({ k: 'A', cx, cy, r, a0, a1 });

// Serpentine centreline in mm, from the channel entrance (x = 42) to the exit (x = 108).
export const SERP_SEGS: Seg[] = [
  L(42, 67.5, 45.25, 67.5),
  A(45.25, 62.5, 5, 90, 0),
  L(50.25, 62.5, 50.25, 38.25),
  A(58.5, 38.25, 8.25, 180, 360),
  L(66.75, 38.25, 66.75, 61.75),
  A(75, 61.75, 8.25, 180, 0),
  L(83.25, 61.75, 83.25, 38.25),
  A(91.5, 38.25, 8.25, 180, 360),
  L(99.75, 38.25, 99.75, 62.5),
  A(104.75, 62.5, 5, 180, 90),
  L(104.75, 67.5, 108, 67.5),
];

// Tube centreline in viewBox units, in flow order.
export const TUBE_SEGS: Seg[] = [
  L(539, 320, 646, 320),
  A(646, 306, 14, 90, 0),
  L(660, 306, 660, 84),
  A(646, 84, 14, 0, -90),
  L(646, 70, 74, 70),
  A(74, 84, 14, -90, -180),
  L(60, 84, 60, 306),
  A(74, 306, 14, 180, 90),
  L(74, 320, 181, 320),
];

export const RADIATOR_ENTRY_X = 598;
export const RADIATOR_EXIT_X = 522;
