import { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { actionUpdateReportItem } from "../../../../redux/action/userSingleReport/actionUserSingleReport";
import { formatReportData } from "../../../../utils/formatReportData";
import { AppDispatch } from "../../../../redux/reducer/store";

import EditPopup from "../../../custom/editPopup/editPopup";

interface IProps {
  setSelectedSkusPhoto: any;
  previousReportIdRef: any;
}

const SkusTableSection: FC<IProps> = ({
  setSelectedSkusPhoto,
  previousReportIdRef,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { report } = useSelector(
    (state: any) => state.userSingleReport.userSingleReport
  );

  const [openItemHotlineIndex, setOpenItemHotlineIndex] = useState<number>(-1);
  const [openItemPriceIndex, setOpenItemPriceIndex] = useState<number>(-1);
  const [openItemGoodsIndex, setOpenItemGoodsIndex] = useState<number>(-1);
  const [openItemFaceIndex, setOpenItemFaceIndex] = useState<number>(-1);

  const [newItemGoodsValue, setNewItemGoodsValue] = useState<string>("");
  const [newItemPriceValue, setNewItemPriceValue] = useState<string>("");
  const [newItemFaceValue, setNewItemFaceValue] = useState<string>("");
  const [newItemHotline, setNewItemHotline] = useState<string>("");

  const [isHiddenPrice, setIsHiddenPrice] = useState<boolean>(false);
  const [isHiddenStock, setIsHiddenStock] = useState<boolean>(false);
  const [isHiddenFace, setIsHiddenFace] = useState<boolean>(false);

  const photoViewerInstance = document.querySelector(".photoviewer-modal");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (report && report?.reportId?.id) {
      if (previousReportIdRef.current !== report?.reportId?.id) {
        if (photoViewerInstance) {
          photoViewerInstance.remove();
        }
      }
    }
  }, [photoViewerInstance, previousReportIdRef, report]);

  useEffect(() => {
    const checkPropertyUndefined = (property: string) =>
      report &&
      report.skus.every((obj: any) => typeof obj[property] === "undefined");

    setIsHiddenStock(checkPropertyUndefined("stockAvailability"));
    setIsHiddenPrice(checkPropertyUndefined("price"));
    setIsHiddenFace(checkPropertyUndefined("face"));
  }, [report, report.reportId.id]);

  useEffect(() => {
    document.addEventListener("mousedown", handleDocumentClick);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  const handleClickCancelRenameBtn = () => {
    setOpenItemHotlineIndex(-1);
    setOpenItemGoodsIndex(-1);
    setOpenItemPriceIndex(-1);
    setOpenItemFaceIndex(-1);
  };

  const handleChangeReportData = (index: number, section: string) => {
    const sectionToStateMap: any = {
      itemFace: {
        setState: setOpenItemFaceIndex,
        state: openItemFaceIndex,
      },
      itemGoods: {
        setState: setOpenItemGoodsIndex,
        state: openItemGoodsIndex,
      },
      itemPrices: {
        setState: setOpenItemPriceIndex,
        state: openItemPriceIndex,
      },
      itemHotline: {
        setState: setOpenItemHotlineIndex,
        state: openItemHotlineIndex,
      },
    };

    const setOpenIndexFunction = sectionToStateMap[section];

    if (setOpenIndexFunction) {
      if (index === setOpenIndexFunction.state) {
        return;
      } else {
        setOpenIndexFunction.setState(index);
      }
    }
  };

  const handleAcceptRenameItems = (elem: any, typeOfValue: string) => {
    const faceValue =
      typeOfValue === "face"
        ? parseFloat(newItemFaceValue) || elem.face
        : elem.face;

    const goodsValue =
      typeOfValue === "goods" &&
      (parseFloat(newItemGoodsValue) || parseFloat(newItemGoodsValue) === 0)
        ? parseFloat(newItemGoodsValue) ||
          parseFloat(
            elem.stockAvailabilityType === "bool" && elem.stockAvailability <= 0
              ? "Нет"
              : elem.stockAvailabilityType === "bool" &&
                elem.stockAvailability > 0
              ? "Да"
              : elem.stockAvailability
          )
        : elem.stockAvailability;

    const priceValue =
      typeOfValue === "prices"
        ? parseFloat(newItemPriceValue) || elem.price
        : elem.price;

    const hotlineValue =
      typeOfValue === "hotline" ? newItemHotline || elem.hotline : elem.hotline;

    dispatch(
      actionUpdateReportItem({
        reportId: report && report.reportId.id,
        data: [
          {
            skuId: {
              id: elem.sku.id,
              name: elem.sku.name,
            },
            face: faceValue,
            hotline: hotlineValue,
            price: priceValue,
            stockAvailability: goodsValue,
          },
        ],
      })
    );

    handleClickCancelRenameBtn();
    setNewItemPriceValue("");
    setNewItemGoodsValue("");
    setNewItemFaceValue("");
    setNewItemHotline("");
  };

  const handleAcceptEditOnKeyPress = (event: any, elem: any, type: string) => {
    if (event.key === "Enter") {
      handleAcceptRenameItems(elem, type);
    }
  };

  const handleDocumentClick = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setOpenItemHotlineIndex(-1);
      setOpenItemGoodsIndex(-1);
      setOpenItemPriceIndex(-1);
      setOpenItemFaceIndex(-1);
    }
  };

  return (
    <>
      <span className="section__title">Данные</span>
      <table className="customer__skus_table">
        <thead className="tunder__thead">
          <tr>
            <th>п/п</th>
            <th>Категория</th>
            <th>Группа</th>
            <th className="wide__skus_cell">Наименование</th>
            {!isHiddenFace && <th>Фейс</th>}
            {!isHiddenStock && <th>Наличие товара</th>}
            {!isHiddenPrice && <th>Цена</th>}
            <th>Горячая линия</th>
          </tr>
        </thead>
        <tbody>
          {report &&
            report.skus
              .slice()
              ?.sort(
                (firstElem: any, secondElem: any) =>
                  firstElem.position - secondElem.position
              )
              ?.map((elem: any, index: number) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{elem.category}</td>
                  <td>{elem.group}</td>
                  <td>
                    <span
                      className={elem?.url ? "sku__name_link" : ""}
                      onClick={() =>
                        elem?.url && setSelectedSkusPhoto(elem?.url?.link)
                      }
                    >
                      {elem.brand} {elem.sku.name}
                    </span>
                  </td>
                  {!isHiddenFace && (
                    <td
                      onClick={() => handleChangeReportData(index, "itemFace")}
                      className="edit__data_text"
                    >
                      <span
                        className={
                          formatReportData(elem?.changes)?.includes("face")
                            ? "changed__table_value"
                            : formatReportData(elem?.equals)?.includes("Face")
                            ? "previous__table_value"
                            : ""
                        }
                      >
                        {elem.face}
                      </span>
                      {openItemFaceIndex === index && (
                        <EditPopup
                          handleClickAcceptRenameBtn={() =>
                            handleAcceptRenameItems(elem, "face")
                          }
                          handleAcceptOnKeyPress={(event: any) =>
                            handleAcceptEditOnKeyPress(event, elem, "face")
                          }
                          handleClickCancelRenameBtn={
                            handleClickCancelRenameBtn
                          }
                          handleChangeValue={(event: any) => {
                            setNewItemFaceValue(event?.target.value);
                          }}
                          defaultValue={elem.face}
                          className="edit__popup"
                          modalRef={modalRef}
                          type="number"
                        />
                      )}
                    </td>
                  )}
                  {!isHiddenStock && (
                    <td
                      onClick={() => handleChangeReportData(index, "itemGoods")}
                      className="edit__data_text"
                    >
                      <span
                        className={
                          formatReportData(elem?.changes)?.includes(
                            "stockAvaliability"
                          )
                            ? "changed__table_value"
                            : formatReportData(elem?.equals)?.includes("Stock")
                            ? "previous__table_value"
                            : ""
                        }
                      >
                        {elem.stockAvailabilityType === "bool" &&
                        elem.stockAvailability <= 0
                          ? "Нет"
                          : elem.stockAvailabilityType === "bool" &&
                            elem.stockAvailability > 0
                          ? "Да"
                          : elem.stockAvailability}
                      </span>
                      {openItemGoodsIndex === index && (
                        <EditPopup
                          handleClickAcceptRenameBtn={() =>
                            handleAcceptRenameItems(elem, "goods")
                          }
                          handleAcceptOnKeyPress={(event: any) =>
                            handleAcceptEditOnKeyPress(event, elem, "goods")
                          }
                          handleClickCancelRenameBtn={
                            handleClickCancelRenameBtn
                          }
                          handleChangeValue={(event: any) => {
                            setNewItemGoodsValue(event?.target.value);
                          }}
                          defaultValue={elem.stockAvailability}
                          className="edit__popup"
                          modalRef={modalRef}
                          type={
                            elem.stockAvailabilityType === "bool"
                              ? "text"
                              : "number"
                          }
                        />
                      )}
                    </td>
                  )}
                  {!isHiddenPrice && (
                    <td
                      onClick={() =>
                        handleChangeReportData(index, "itemPrices")
                      }
                      className="edit__data_text"
                    >
                      <span
                        className={
                          elem?.changes?.includes("price")
                            ? "changed__table_value"
                            : elem?.equals?.includes("Price")
                            ? "previous__table_value"
                            : ""
                        }
                      >
                        {elem.price}
                      </span>
                      {openItemPriceIndex === index && (
                        <EditPopup
                          handleClickAcceptRenameBtn={() =>
                            handleAcceptRenameItems(elem, "prices")
                          }
                          handleAcceptOnKeyPress={(event: any) =>
                            handleAcceptEditOnKeyPress(event, elem, "prices")
                          }
                          handleClickCancelRenameBtn={
                            handleClickCancelRenameBtn
                          }
                          handleChangeValue={(event: any) => {
                            setNewItemPriceValue(event?.target.value);
                          }}
                          defaultValue={elem.price}
                          className="edit__popup"
                          modalRef={modalRef}
                          type="number"
                        />
                      )}
                    </td>
                  )}
                  <td
                    onClick={() => handleChangeReportData(index, "itemHotline")}
                    className="edit__data_text"
                  >
                    <span
                      className={
                        formatReportData(elem?.changes)?.includes("hotline")
                          ? "changed__table_value"
                          : formatReportData(elem?.equals)?.includes("Hotline")
                          ? "previous__table_value"
                          : ""
                      }
                    >
                      {elem.hotline || "—"}
                    </span>
                    {openItemHotlineIndex === index && (
                      <EditPopup
                        handleClickAcceptRenameBtn={() =>
                          handleAcceptRenameItems(elem, "hotline")
                        }
                        handleAcceptOnKeyPress={(event: any) =>
                          handleAcceptEditOnKeyPress(event, elem, "hotline")
                        }
                        handleClickCancelRenameBtn={handleClickCancelRenameBtn}
                        handleChangeValue={(event: any) => {
                          setNewItemHotline(event?.target.value);
                        }}
                        defaultValue={elem.hotline}
                        className="edit__popup"
                        modalRef={modalRef}
                      />
                    )}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </>
  );
};

export default SkusTableSection;
