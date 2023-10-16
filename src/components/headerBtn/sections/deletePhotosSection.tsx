import { FC } from "react";
import { useSelector } from "react-redux";

import styles from "../headerBtn.module.scss";

const DeletePhotosSection: FC = () => {
  const { report, photos } = useSelector(
    (state: any) => state.userSingleReport.userSingleReport
  );

  return (
    <div className={styles.delete__photos_wrapper}>
      {photos && !photos.length ? (
        <span>Не выбрано ни одной фотографии для удаления</span>
      ) : (
        <div className={styles.photo__card_block}>
          <span className={styles.delete__photo_question}>
            Удалить данные фотографии?
          </span>
          <div className={styles.delete__photo_list}>
            {report &&
              report.medias
                .filter((elem: any) => photos.includes(elem.media.id))
                .map((image: any) => (
                  <img
                    className={styles.delete__photo_img}
                    src={image?.url?.thumb}
                    key={image.media.id}
                    alt="undefined"
                  />
                ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeletePhotosSection;
