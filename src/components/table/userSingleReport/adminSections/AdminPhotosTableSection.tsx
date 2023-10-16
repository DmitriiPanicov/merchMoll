import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  formatMediasDateTime,
  getCorrectDate,
} from "../../../../utils/formatDate";
import { reducerDeletePhotosId } from "../../../../redux/reducer/userSingleReport/reducers/userSingleReport";
import { actionRenamePhotoCard } from "../../../../redux/action/userSingleReport/actionUserSingleReport";
import { AppDispatch } from "../../../../redux/reducer/store";

import EditPopup from "../../../custom/editPopup/editPopup";

interface IProps {
  setOpenDatePopupIndex: any;
  previousReportIdRef: any;
  openDatePopupIndex: any;
  setOpenPopupIndex: any;
  setSelectedPhoto: any;
  openPopupIndex: any;
  scrollModal: any;
  namePurpose: any;
  datePurpose: any;
  modalRef: any;
  medias: any;
  title: any;
}

const AdminPhotosTableSection: FC<IProps> = ({
  setOpenDatePopupIndex,
  previousReportIdRef,
  openDatePopupIndex,
  setOpenPopupIndex,
  setSelectedPhoto,
  openPopupIndex,
  namePurpose,
  datePurpose,
  scrollModal,
  modalRef,
  medias,
  title,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { photos, report } = useSelector(
    (state: any) => state.userSingleReport.userSingleReport
  );

  const [newPhotoNameValue, setNewPhotoNameValue] = useState<string>("");
  const [newPhotoDateValue, setNewPhotoDateValue] = useState<any>(null);

  const photoViewerInstance = document.querySelector(".photoviewer-modal");

  useEffect(() => {
    if (report && report?.reportId?.id) {
      if (previousReportIdRef.current !== report?.reportId?.id) {
        if (photoViewerInstance) {
          photoViewerInstance.remove();
        }
      }
    }
  }, [photoViewerInstance, previousReportIdRef, report]);

  const handlePhotoSelection = (cardId: any) => {
    if (photos.includes(cardId)) {
      dispatch(
        reducerDeletePhotosId(
          photos.filter((selectedCardId: any) => selectedCardId !== cardId)
        )
      );
    } else {
      dispatch(reducerDeletePhotosId([...photos, cardId]));
    }
  };

  const handleAcceptEditOnKeyPress = (
    event: any,
    purpose: string,
    elem?: any
  ) => {
    if (event.key === "Enter") {
      if (purpose === "photoName" || purpose === "photoDate") {
        handleClickAcceptRenameBtn(elem);
      }
    }
  };

  const handleClickAcceptRenameBtn = (elem: any) => {
    setOpenDatePopupIndex(-1);
    setOpenPopupIndex(-1);

    dispatch(
      actionRenamePhotoCard({
        reportId: report && report.reportId.id,
        medias: {
          media: {
            id: elem.media.id,
          },
          name: newPhotoNameValue || elem?.media?.name,
          date:
            (newPhotoDateValue && getCorrectDate(newPhotoDateValue)) ||
            elem?.date,
          url: elem.url,
        },
      })
    );

    setNewPhotoNameValue("");
    setNewPhotoDateValue(null);
  };

  const handleChangeReportData = (
    index: number,
    category: string,
    elem?: any
  ) => {
    const stateToUpdate: any = {
      before: { state: openPopupIndex, setter: setOpenPopupIndex },
      after: {
        state: openPopupIndex,
        setter: setOpenPopupIndex,
      },
      dateBefore: { state: openDatePopupIndex, setter: setOpenDatePopupIndex },
      dateAfter: {
        state: openDatePopupIndex,
        setter: setOpenDatePopupIndex,
      },
    }[category];

    if (stateToUpdate.state === index) {
      return;
    } else {
      stateToUpdate.setter(index);
    }

    if (category.includes("date")) {
      setNewPhotoDateValue(new Date(elem?.date));
    }
  };

  return (
    <>
      <span className="section__title">{title}</span>
      <div className="customer__photo_table">
        {medias
          ?.filter((media: any) => media.category !== "CustomerCheck")
          .map((elem: any, index: number) => (
            <div className="photo__block" key={index}>
              <div className="photo__block_row">
                <input
                  onChange={() => handlePhotoSelection(elem.media.id)}
                  checked={photos?.includes(elem.media.id) || false}
                  type="checkbox"
                />
                <img
                  src={elem?.url?.link}
                  className="photo__img"
                  id={elem.media.id}
                  alt="product"
                  onClick={() => setSelectedPhoto(elem?.url?.link)}
                />
              </div>
              <div className="photo__block_row">
                <span className="photo__merch_text">
                  {report && report.merch.familyName}{" "}
                  {report && report.merch.givenName}
                </span>
              </div>
              <div className="photo__block_row">
                <span
                  onClick={() => {
                    handleChangeReportData(index, namePurpose);
                    setTimeout(scrollModal, 0);
                  }}
                  className="photo__card_name"
                >
                  {elem?.media?.name}
                </span>
                {openPopupIndex === index && (
                  <EditPopup
                    handleClickAcceptRenameBtn={() =>
                      handleClickAcceptRenameBtn(elem)
                    }
                    handleAcceptOnKeyPress={(event: any) =>
                      handleAcceptEditOnKeyPress(event, "photoName", elem)
                    }
                    handleClickCancelRenameBtn={() => {
                      setOpenPopupIndex(-1);
                    }}
                    handleChangeValue={(event: any) =>
                      setNewPhotoNameValue(event.target.value)
                    }
                    defaultValue={elem?.media?.name}
                    className="rename__card_popup"
                    modalRef={modalRef}
                  />
                )}
              </div>
              <div className="photo__block_row">
                <span>{Object.values(elem.category)}</span>
              </div>
              <div className="photo__block_row">
                <span
                  onClick={() => {
                    handleChangeReportData(index, datePurpose, elem);
                    setTimeout(scrollModal, 0);
                  }}
                  className="photo__card_name"
                >
                  {elem.date && formatMediasDateTime(elem.date)}
                </span>
                {openDatePopupIndex === index && (
                  <EditPopup
                    handleClickAcceptRenameBtn={() =>
                      handleClickAcceptRenameBtn(elem)
                    }
                    handleAcceptOnKeyPress={(event: any) =>
                      handleAcceptEditOnKeyPress(event, "photoDate", elem)
                    }
                    handleClickCancelRenameBtn={() => {
                      setOpenDatePopupIndex(-1);
                    }}
                    handleChangeValue={(event: any) =>
                      setNewPhotoDateValue(event)
                    }
                    defaultValue={newPhotoDateValue}
                    className="rename__card_popup"
                    modalRef={modalRef}
                    purpose="photoDate"
                  />
                )}
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default AdminPhotosTableSection;
