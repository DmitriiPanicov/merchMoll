import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import clsx from "clsx";

import {
  actionGetUserSingleReport,
  actionGetTunderSignals,
} from "../../../redux/action/userSingleReport/actionUserSingleReport";
import { getLabelByValue } from "../../../utils/getLabelByValue";
import { AppDispatch } from "../../../redux/reducer/store";

import "../table.scss";

const typeOptions = [
  { value: "After", label: "После окончания" },
  { value: "Before", label: "До начала" },
];

const IS_VISIBLE_SIDEBAR = process.env.REACT_APP_IS_VISIBLE_SIDEBAR;

const TableTunderSignals: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();

  const { isOpenSidebar } = useSelector((state: any) => state.user.user);
  const { report, tunderSignals } = useSelector(
    (state: any) => state.userSingleReport.userSingleReport
  );

  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

  const photoViewerInstance = document.querySelector(".photoviewer-modal");

  useEffect(() => {
    if (!report) {
      dispatch(actionGetUserSingleReport(id as string));
    } else {
      dispatch(
        actionGetTunderSignals({
          contractId: report && report?.contract?.id,
          posId: report && report?.pos?.pos?.id,
          date: report && report?.expected,
        })
      );
    }
  }, [dispatch, id, report]);

  useEffect(() => {
    const openPhotoViewer = (items: any[], selected: string | null) => {
      if (selected) {
        const options = {
          index: items.findIndex((item: any) => item?.src?.includes(selected)),
        };

        if (photoViewerInstance) {
          photoViewerInstance.remove();
        }

        new PhotoViewer(items, options);
      }
    };

    if (selectedPhoto) {
      const items = tunderSignals?.flatMap((item: any) =>
        item.medias.map((media: any) => ({ src: media?.url?.link }))
      );

      openPhotoViewer(items, selectedPhoto);
      setSelectedPhoto(null);
    }
  }, [photoViewerInstance, selectedPhoto, report, tunderSignals]);

  return (
    <div
      className={clsx(
        JSON.parse(IS_VISIBLE_SIDEBAR as string) &&
          isOpenSidebar &&
          "customerSingle__report_activeTable",
        !isOpenSidebar && "customerSingle__report_closedTable",
        "tunder__signals_table"
      )}
    >
      <span className="section__title">Выполненные сигналы</span>
      <div className="line"></div>
      {tunderSignals &&
        tunderSignals.map((elem: any, index: number) => (
          <div className="tunder__signals_children" key={index}>
            <span className="section__title">{elem?.productName}</span>
            <table className="tt__card_table">
              <thead className="tunder__thead">
                <tr>
                  <th>Наименование</th>
                  <th>Значение</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Товар отсутствует в ТТ</td>
                  <td>{elem?.isAvailable ? "Да" : "Нет"}</td>
                </tr>
                <tr>
                  <td>Наличие виртульных остатков</td>
                  <td>{elem?.isVirtualRestRisk ? "Да" : "Нет"}</td>
                </tr>
                <tr>
                  <td>Есть иная проблема с товаром на полке</td>
                  <td>{!!elem?.problemProductCode ? "Да" : "Нет"}</td>
                </tr>
                <tr>
                  <td>Есть проблема с магазином</td>
                  <td>{!!elem?.problemShopCode ? "Да" : "Нет"}</td>
                </tr>
                <tr>
                  <td>Истек срок годности</td>
                  <td>{elem?.isExpirationDateExceeded ? "Да" : "Нет"}</td>
                </tr>
              </tbody>
            </table>
            <div className="customer__photo_table">
              {elem?.medias?.map((photo: any, index: number) => (
                <div className="customer__photo_block" key={index}>
                  <div className="photo__block_row">
                    <img
                      onClick={() => setSelectedPhoto(photo?.url?.link)}
                      className="photo__img"
                      src={photo?.url?.link}
                      alt="product"
                    />
                  </div>
                  <div className="photo__block_row">
                    <span className="photo__card_name">
                      {getLabelByValue(photo?.type, typeOptions)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default TableTunderSignals;
