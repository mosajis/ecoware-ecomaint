export const STATUS_COLORS = {
  1: "144, 202, 249",
  2: "100, 181, 246",
  3: "77, 182, 172",
  4: "255, 183, 77",
  5: "129, 199, 132",
  6: "149, 117, 205",
  7: "229, 115, 115",
  8: "255, 241, 118",
} as const satisfies Record<number, string>;

export const KPI_COLORS = {
  blue: "25, 118, 210",
  yellow: "255, 152, 0",
  green: "76, 175, 80",
  red: "244, 67, 54",
} as const;
