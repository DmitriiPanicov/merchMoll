export const createOptions = (data: any, key: string) => {
  if (!data) return [];

  const options = data[0]?.[key]?.map((option: any) => ({
    value: option.id >= 0 ? option.id : option,
    label: option.name || option,
  }));

  options &&
    options
      .sort((a: any, b: any) => a.label.localeCompare(b.label))
      .unshift({ value: "", label: "Все" });

  return options;
};
