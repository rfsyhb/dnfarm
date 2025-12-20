export const getDateString = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString();
};

export const getMsDurationString = (startIso: string, endIso: string) => {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const diffMs = end.getTime() - start.getTime();

  if (diffMs < 0) return 0;
  return diffMs;
};
