import { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { actionUpdateReportAction } from "../../../../redux/action/userSingleReport/actionUserSingleReport";
import { formatReportData } from "../../../../utils/formatReportData";
import { AppDispatch } from "../../../../redux/reducer/store";

import EditPopup from "../../../custom/editPopup/editPopup";

const ActionTableSection: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { report } = useSelector(
    (state: any) => state.userSingleReport.userSingleReport
  );

  const [openOutletActionValueIndex, setOpenOutletActionValueIndex] =
    useState<number>(-1);
  const [openOutletActionHotlineIndex, setOpenOutletActionHotlineIndex] =
    useState<number>(-1);
  const [newActionHotline, setNewActionHotline] = useState<string>("");
  const [newActionValue, setNewActionValue] = useState<string>("");

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleDocumentClick);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  const handleClickCancelRenameBtn = () => {
    setOpenOutletActionHotlineIndex(-1);
    setOpenOutletActionValueIndex(-1);
  };

  const handleChangeReportData = (index: number, section: string) => {
    const sectionToStateMap: any = {
      outletActionValue: {
        setState: setOpenOutletActionValueIndex,
        state: openOutletActionValueIndex,
      },
      outletActionHotline: {
        setState: setOpenOutletActionHotlineIndex,
        state: openOutletActionHotlineIndex,
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

  const handleAcceptRenameAction = (action: any, typeOfValue: string) => {
    dispatch(
      actionUpdateReportAction({
        reportId: report && report.reportId.id,
        data: [
          {
            action: {
              id: action.action.id,
            },
            hotline:
              typeOfValue === "hotline"
                ? newActionHotline || action.hotline
                : action.hotline,
            value:
              typeOfValue === "value"
                ? newActionValue || action.value
                : action.value,
          },
        ],
      })
    );

    handleClickCancelRenameBtn();
    setNewActionHotline("");
    setNewActionValue("");
  };

  const handleAcceptEditOnKeyPress = (
    event: any,
    action: any,
    type: string
  ) => {
    if (event.key === "Enter") {
      handleAcceptRenameAction(action, type);
    }
  };

  const handleDocumentClick = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setOpenOutletActionHotlineIndex(-1);
      setOpenOutletActionValueIndex(-1);
    }
  };

  return (
    <>
      <span className="section__title">Акции по ТТ</span>
      <table className="customerOutlet__data_table">
        <thead className="tunder__thead">
          <tr>
            <th>Наименование</th>
            <th>Значение</th>
            <th>Горячая линия</th>
          </tr>
        </thead>
        <tbody>
          {report &&
            report?.actions?.map((action: any, index: any) => {
              return (
                <tr key={index}>
                  <td>{action.action.name}</td>
                  <td
                    onClick={() =>
                      handleChangeReportData(index, "outletActionValue")
                    }
                    className="edit__data_text"
                  >
                    <span
                      className={
                        formatReportData(action?.changes)?.includes("value")
                          ? "changed__table_value"
                          : formatReportData(action?.equals)?.includes("Value")
                          ? "previous__table_value"
                          : ""
                      }
                    >
                      {action.value}
                    </span>
                    {openOutletActionValueIndex === index && (
                      <EditPopup
                        handleClickAcceptRenameBtn={() =>
                          handleAcceptRenameAction(action, "value")
                        }
                        handleAcceptOnKeyPress={(event: any) =>
                          handleAcceptEditOnKeyPress(event, action, "value")
                        }
                        handleClickCancelRenameBtn={handleClickCancelRenameBtn}
                        handleChangeValue={(event: any) => {
                          setNewActionValue(event?.target.value);
                        }}
                        defaultValue={action.value}
                        className="edit__popup"
                        modalRef={modalRef}
                      />
                    )}
                  </td>
                  <td
                    onClick={() =>
                      handleChangeReportData(index, "outletActionHotline")
                    }
                    className="edit__data_text"
                  >
                    <span
                      className={
                        formatReportData(action?.changes)?.includes("hotline")
                          ? "changed__table_value"
                          : formatReportData(action?.equals)?.includes(
                              "Hotline"
                            )
                          ? "previous__table_value"
                          : ""
                      }
                    >
                      {action.hotline || "—"}
                    </span>
                    {openOutletActionHotlineIndex === index && (
                      <EditPopup
                        handleClickAcceptRenameBtn={() =>
                          handleAcceptRenameAction(action, "hotline")
                        }
                        handleAcceptOnKeyPress={(event: any) =>
                          handleAcceptEditOnKeyPress(event, action, "hotline")
                        }
                        handleClickCancelRenameBtn={handleClickCancelRenameBtn}
                        handleChangeValue={(event: any) => {
                          setNewActionHotline(event?.target.value);
                        }}
                        defaultValue={action.hotline}
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

export default ActionTableSection;
