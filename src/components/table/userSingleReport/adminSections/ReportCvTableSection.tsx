import { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { actionUpdateReportCv } from "../../../../redux/action/userSingleReport/actionUserSingleReport";
import { formatReportData } from "../../../../utils/formatReportData";
import { AppDispatch } from "../../../../redux/reducer/store";

import EditPopup from "../../../custom/editPopup/editPopup";

const CvTableSection: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { report } = useSelector(
    (state: any) => state.userSingleReport.userSingleReport
  );

  const [openOutletHotlineIndex, setOpenOutletHotlineIndex] =
    useState<number>(-1);
  const [openOutletDataIndex, setOpenOutletDataIndex] = useState<number>(-1);
  const [newCvHotline, setNewCvHotline] = useState<string>("");
  const [newCvValue, setNewCvValue] = useState<string>("");

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleDocumentClick);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  const handleClickCancelRenameBtn = () => {
    setOpenOutletHotlineIndex(-1);
    setOpenOutletDataIndex(-1);
  };

  const handleChangeReportData = (index: number, section: string) => {
    const sectionToStateMap: any = {
      outletData: {
        setState: setOpenOutletDataIndex,
        state: openOutletDataIndex,
      },
      outletHotline: {
        setState: setOpenOutletHotlineIndex,
        state: openOutletHotlineIndex,
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

  const handleAcceptRenameCv = (elem: any, typeOfValue: string) => {
    dispatch(
      actionUpdateReportCv({
        reportId: report && report.reportId.id,
        data: [
          {
            name: elem.name,
            value:
              typeOfValue === "value" ? newCvValue || elem.value : elem.value,
            hotline:
              typeOfValue === "hotline"
                ? newCvHotline || elem.hotline
                : elem.hotline,
          },
        ],
      })
    );

    handleClickCancelRenameBtn();
    setNewCvHotline("");
    setNewCvValue("");
  };

  const handleAcceptEditOnKeyPress = (event: any, elem: any, type: string) => {
    if (event.key === "Enter") {
      handleAcceptRenameCv(elem, type);
    }
  };

  const handleDocumentClick = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setOpenOutletHotlineIndex(-1);
      setOpenOutletDataIndex(-1);
    }
  };

  return (
    <>
      <span className="section__title">Данные по ТТ</span>
      <table className="customer__skus_table">
        <thead className="tunder__thead">
          <tr>
            <th>Наименование</th>
            <th>Значение</th>
            <th>Горячая линия</th>
          </tr>
        </thead>
        <tbody>
          {report &&
            report.cv.map((elem: any, index: number) => {
              return (
                <tr key={index}>
                  <td>{elem.name}</td>
                  <td
                    onClick={() => handleChangeReportData(index, "outletData")}
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
                    {openOutletDataIndex === index && (
                      <EditPopup
                        handleClickAcceptRenameBtn={() => {
                          handleAcceptRenameCv(elem, "value");
                        }}
                        handleAcceptOnKeyPress={(event: any) =>
                          handleAcceptEditOnKeyPress(event, elem, "value")
                        }
                        handleClickCancelRenameBtn={handleClickCancelRenameBtn}
                        handleChangeValue={(event: any) => {
                          setNewCvValue(event?.target.value);
                        }}
                        defaultValue={elem.value}
                        className="edit__popup"
                        modalRef={modalRef}
                      />
                    )}
                  </td>
                  <td
                    onClick={() =>
                      handleChangeReportData(index, "outletHotline")
                    }
                    className="edit__data_text"
                  >
                    <span>{elem.hotline || "—"}</span>
                    {openOutletHotlineIndex === index && (
                      <EditPopup
                        handleClickAcceptRenameBtn={() => {
                          handleAcceptRenameCv(elem, "hotline");
                        }}
                        handleAcceptOnKeyPress={(event: any) =>
                          handleAcceptEditOnKeyPress(event, elem, "hotline")
                        }
                        handleClickCancelRenameBtn={handleClickCancelRenameBtn}
                        handleChangeValue={(event: any) => {
                          setNewCvHotline(event?.target.value);
                        }}
                        defaultValue={elem.hotline}
                        className="edit__popup"
                        modalRef={modalRef}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};

export default CvTableSection;
