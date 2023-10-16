import { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { actionUpdateSkuAction } from "../../../../redux/action/userSingleReport/actionUserSingleReport";
import { formatReportData } from "../../../../utils/formatReportData";
import { AppDispatch } from "../../../../redux/reducer/store";

import EditPopup from "../../../custom/editPopup/editPopup";

const SkuActionsTableSection: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { report } = useSelector(
    (state: any) => state.userSingleReport.userSingleReport
  );

  const [openActionValueIndex, setOpenActionValueIndex] = useState<number>(-1);
  const [openActionHotlineIndex, setOpenActionHotlineIndex] =
    useState<number>(-1);
  const [newSkuActionHotline, setNewSkuActionHotline] = useState<string>("");
  const [newSkuActionValue, setNewSkuActionValue] = useState<string>("");

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleDocumentClick);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  const handleClickCancelRenameBtn = () => {
    setOpenActionHotlineIndex(-1);
    setOpenActionValueIndex(-1);
  };

  const handleChangeReportData = (index: number, section: string) => {
    const sectionToStateMap: any = {
      actionValue: {
        setState: setOpenActionValueIndex,
        state: openActionValueIndex,
      },
      actionHotline: {
        setState: setOpenActionHotlineIndex,
        state: openActionHotlineIndex,
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

  const handleAcceptRenameSkuAction = (action: any, typeOfValue: string) => {
    dispatch(
      actionUpdateSkuAction({
        reportId: report && report.reportId.id,
        data: [
          {
            action: {
              id: action.action.id,
            },
            sku: {
              id: action.skuId,
              name: action.skuName,
            },
            hotline:
              typeOfValue === "hotline"
                ? newSkuActionHotline || action.hotline
                : action.hotline,
            value:
              typeOfValue === "value"
                ? newSkuActionValue || action.value
                : action.value,
          },
        ],
      })
    );

    handleClickCancelRenameBtn();
    setNewSkuActionHotline("");
    setNewSkuActionValue("");
  };

  const handleAcceptEditOnKeyPress = (
    event: any,
    action: any,
    type: string
  ) => {
    if (event.key === "Enter") {
      handleAcceptRenameSkuAction(action, type);
    }
  };

  const handleDocumentClick = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setOpenActionHotlineIndex(-1);
      setOpenActionValueIndex(-1);
    }
  };

  return (
    <>
      <span className="section__title">Акции по товарам</span>
      <table className="customerOutlet__data_table">
        <thead className="tunder__thead">
          <tr>
            <th>Акция</th>
            <th>Наименование</th>
            <th>Значение</th>
            <th>Горячая линия</th>
          </tr>
        </thead>
        <tbody>
          {report &&
            report?.skuActions?.map((action: any, index: any) => {
              return (
                <tr key={index}>
                  <td>{action.action.name}</td>
                  <td>{action.skuName}</td>
                  <td
                    onClick={() => handleChangeReportData(index, "actionValue")}
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
                    {openActionValueIndex === index && (
                      <EditPopup
                        handleClickAcceptRenameBtn={() =>
                          handleAcceptRenameSkuAction(action, "value")
                        }
                        handleAcceptOnKeyPress={(event: any) =>
                          handleAcceptEditOnKeyPress(event, action, "value")
                        }
                        handleClickCancelRenameBtn={handleClickCancelRenameBtn}
                        handleChangeValue={(event: any) => {
                          setNewSkuActionValue(event?.target.value);
                        }}
                        defaultValue={action.value}
                        className="edit__popup"
                        modalRef={modalRef}
                      />
                    )}
                  </td>
                  <td
                    onClick={() =>
                      handleChangeReportData(index, "actionHotline")
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

                    {openActionHotlineIndex === index && (
                      <EditPopup
                        handleClickAcceptRenameBtn={() =>
                          handleAcceptRenameSkuAction(action, "hotline")
                        }
                        handleAcceptOnKeyPress={(event: any) =>
                          handleAcceptEditOnKeyPress(event, action, "hotline")
                        }
                        handleClickCancelRenameBtn={handleClickCancelRenameBtn}
                        handleChangeValue={(event: any) => {
                          setNewSkuActionHotline(event?.target.value);
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

export default SkuActionsTableSection;
