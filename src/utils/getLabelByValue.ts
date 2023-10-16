export const getLabelByValue = (value: string | number, options: any) => {
  const option = options?.find((option: any) => option.value === value);
  return option ? option.label : "";
};
