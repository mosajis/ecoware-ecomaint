export const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000);

export const periodToDays = (periodId: number): number => {
  const map: Record<number, number> = {
    1: 1, // Day
    2: 7, // Week
    3: 30, // Month
    4: 365, // Year
  };
  return map[periodId] || 1;
};
