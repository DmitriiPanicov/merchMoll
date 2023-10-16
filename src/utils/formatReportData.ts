export const formatReportData = (data?: any) => {
  return data?.map((elem: any) => Object.keys(elem).toString()) || [];
};
