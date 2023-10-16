export const getVisibleHistory = (historyArray: any, currentPage: any) =>
  historyArray?.slice((currentPage - 1) * 10, (currentPage - 1) * 10 + 10);
