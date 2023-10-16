import { FC } from "react";

import { formatMediasDateTime } from "../../../../utils/formatDate";

interface IProps {
  setSelectedPhoto: any;
  medias: any;
  title: any;
}

const CustomerPhotoTableSection: FC<IProps> = ({
  setSelectedPhoto,
  medias,
  title,
}) => {
  return (
    <>
      <span className="section__title">{title}</span>
      <div className="customer__photo_table">
        {medias.map((elem: any, index: number) => (
          <div className="customer__photo_block" key={index}>
            <div className="photo__block_row">
              <img
                src={elem?.url?.link}
                onClick={() => setSelectedPhoto(elem?.url?.link)}
                className="photo__img"
                id={elem.media.id}
                alt="product"
              />
            </div>
            <div className="photo__block_row">
              <span className="photo__card_name">{elem.media.name}</span>
            </div>
            <div className="photo__block_row">
              <span>{elem.date && formatMediasDateTime(elem.date)}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CustomerPhotoTableSection;
