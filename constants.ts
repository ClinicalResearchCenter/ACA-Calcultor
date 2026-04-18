export const FPL_2025_48_DC: Record<number, number> = {
  1: 15650,
  2: 21150,
  3: 26650,
  4: 32150,
  5: 37650,
  6: 43150,
  7: 48650,
  8: 54150,
};

export const FPL_2025_ALASKA: Record<number, number> = {
  1: 19550,
  2: 26430,
  3: 33310,
  4: 40190,
  5: 47070,
  6: 53950,
  7: 60830,
  8: 67710,
};

export const FPL_2025_HAWAII: Record<number, number> = {
  1: 17990,
  2: 24320,
  3: 30650,
  4: 36980,
  5: 43310,
  6: 49640,
  7: 55970,
  8: 62300,
};

export const ADDITIONAL_PERSON_FPL = {
  contiguous: 5500,
  alaska: 6880,
  hawaii: 6330,
};

export const CONTIGUOUS_STATES = new Set([
  'AL','AZ','AR','CA','CO','CT','DE','FL','GA','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT',
  'NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
]);

export const APPLICABLE_PERCENTAGE_2026 = [
  { min: 0, max: 1.33, initial: 0.0, final: 0.0 },
  { min: 1.33, max: 1.5, initial: 0.0, final: 0.02 },
  { min: 1.5, max: 2.0, initial: 0.02, final: 0.04 },
  { min: 2.0, max: 2.5, initial: 0.04, final: 0.063 },
  { min: 2.5, max: 3.0, initial: 0.063, final: 0.08 },
  { min: 3.0, max: 4.0, initial: 0.08, final: 0.0996 },
];
