export const sortByDate = (medias: any) =>
  medias
    ?.filter((elem: any) => elem?.date)
    ?.sort(
      (firstMedia: any, secondMedia: any) =>
        new Date(firstMedia.date).getTime() -
        new Date(secondMedia.date).getTime()
    );
