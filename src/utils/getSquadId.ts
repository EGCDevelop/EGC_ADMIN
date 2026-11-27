export const getSquadId = (closetId: number): number => {
  if ([1, 12, 14, 16].includes(closetId)) return 1;
  if ([2, 13, 15].includes(closetId)) return 2;
  return 6;
};
