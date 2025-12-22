export const monthOrder: Record<string, number> = {
  JAN: 1,
  FEB: 2,
  MAR: 3,
  APR: 4,
  MAY: 5,
  JUN: 6,
  JUL: 7,
  AUG: 8,
  SEP: 9,
  OCT: 10,
  NOV: 11,
  DEC: 12,
};

export const orderReadingsDesc = (
  a: { year: number; month: string },
  b: { year: number; month: string }
) => {
  if (b.year !== a.year) {
    return b.year - a.year;
  }
  return monthOrder[b.month] - monthOrder[a.month];
};
