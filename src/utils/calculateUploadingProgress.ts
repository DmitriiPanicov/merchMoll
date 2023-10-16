export const calculateProgress = (
  setProgress: any,
  fileIndex: number,
  loaded: number,
  total: number
) => {
  const progress = (loaded / total) * 100;
  setProgress((prevProgress: any) => {
    const updatedProgress = [...prevProgress];
    updatedProgress[fileIndex] = progress;
    return updatedProgress;
  });
};
