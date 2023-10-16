import { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { actionUpdateReportSkuCv } from "../../../../redux/action/userSingleReport/actionUserSingleReport";
import { formatReportData } from "../../../../utils/formatReportData";
import { AppDispatch } from "../../../../redux/reducer/store";

import EditPopup from "../../../custom/editPopup/editPopup";

const SkuCvTableSection: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { report } = useSelector(
    (state: any) => state.userSingleReport.userSingleReport
  );

  const [openValueIndex, setOpenValueIndex] = useState<number>(-1);
  const [newValue, setNewValue] = useState<string>("");

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleDocumentClick);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  const handleClickCancelRenameBtn = () => {
    setOpenValueIndex(-1);
  };

  const handleChangeReportData = (index: number) => {
    if (index === openValueIndex) {
      return;
    } else {
      setOpenValueIndex(index);
    }
  };

  const handleAcceptRenameSkuCv = (elem: any) => {
    dispatch(
      actionUpdateReportSkuCv({
        reportId: report && report.reportId.id,
        data: [
          {
            sku: {
              id: elem.sku.id,
              name: elem.sku.name,
            },
            name: elem.name,
            value: newValue || elem.value,
            hotline: elem.hotline,
          },
        ],
      })
    );

    handleClickCancelRenameBtn();
    setNewValue("");
  };

  const handleAcceptEditOnKeyPress = (event: any, elem: any) => {
    if (event.key === "Enter") {
      handleAcceptRenameSkuCv(elem);
    }
  };

  const handleDocumentClick = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setOpenValueIndex(-1);
    }
  };

  return (
    <>
      <span className="section__title">Доп. данные по товарам</span>
      <table className="customerOutlet__data_table">
        <thead className="tunder__thead">
          <tr>
            <th>Наименование</th>
            <th>SKU</th>
            <th>Значение</th>
            <th>Горячая линия</th>
          </tr>
        </thead>
        <tbody>
          {report &&
            report.skuCv.map((elem: any, index: number) => (
              <tr key={index}>
                <td>{elem.name}</td>
                <td>
                  {elem?.brand} {elem.sku.name}
                </td>
                <td
                  onClick={() => handleChangeReportData(index)}
                  className="edit__data_text"
                >
                  <span
                    className={
                      formatReportData(elem?.changes)?.includes("value")
                        ? "changed__table_value"
                        : formatReportData(elem?.equals)?.includes("Value")
                        ? "previous__table_value"
                        : ""
                    }
                  >
                    {elem.value}
                  </span>
                  {openValueIndex === index && (
                    <EditPopup
                      handleClickAcceptRenameBtn={() => {
                        handleAcceptRenameSkuCv(elem);
                      }}
                      handleAcceptOnKeyPress={(event: any) =>
                        handleAcceptEditOnKeyPress(event, elem)
                      }
                      handleClickCancelRenameBtn={handleClickCancelRenameBtn}
                      handleChangeValue={(event: any) => {
                        setNewValue(event?.target.value);
                      }}
                      defaultValue={elem.value}
                      className="edit__popup"
                      modalRef={modalRef}
                    />
                  )}
                </td>
                <td>
                  <span>{elem.hotline ? elem.hotline : "—"}</span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default SkuCvTableSection;
