export const formatReports = (reports: any) => {
  return (
    reports &&
    Object.entries(reports)
      .filter(([key, value]) => value === true)
      .map(([key]) => ({ id: parseFloat(key) }))
  );
};
