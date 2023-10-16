export const createItemsArray = (data: any, titleKey?: any) =>
  (data || []).map((elem: any) => ({
    src: elem?.url?.link,
    ...(titleKey && { title: elem[titleKey] }),
  }));
