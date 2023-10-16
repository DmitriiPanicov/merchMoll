import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import clsx from "clsx";

import { actionReviewByCheck } from "../../../redux/action/userSingleReport/actionUserSingleReport";
import { AppDispatch } from "../../../redux/reducer/store";

import { ReactComponent as ClosedEyeIcon } from "../../../assets/icons/closedEye.svg";
import { ReactComponent as OpenEyeIcon } from "../../../assets/icons/openEye.svg";

const CriteriasPopup: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    isCriteriasListExist,
    criteriasListIds,
    criteriasList,
    checkedIds,
    report,
  } = useSelector((state: any) => state.userSingleReport.userSingleReport);

  const [selectedCheckboxesId, setSelectedCheckboxId] = useState<number[]>([]);
  const [commentValue, setCommentValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState(true);

  const isAllCheckboxesChecked =
    criteriasList &&
    criteriasList.every((item: any) =>
      selectedCheckboxesId.includes(item.reason.id)
    );

  useEffect(() => {
    if (checkedIds && checkedIds !== undefined) {
      setSelectedCheckboxId(checkedIds);
    }
  }, [checkedIds, report]);

  const handleOpenCriteriasCheck = () => {
    setIsOpen(!isOpen);
  };

  const handlePopupClick = (event: any) => {
    event.stopPropagation();
  };

  const handleChangeComment = (event: any) => {
    setCommentValue(event.target.value);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checkboxId = parseInt(event.target.value);

    if (checkboxId === 0) {
      setSelectedCheckboxId(event.target.checked ? criteriasListIds : []);
    } else {
      setSelectedCheckboxId(
        selectedCheckboxesId.includes(checkboxId)
          ? selectedCheckboxesId.filter((id) => id !== checkboxId)
          : [...selectedCheckboxesId, checkboxId]
      );
    }
  };

  const handleClickCheckBtn = () => {
    dispatch(
      actionReviewByCheck({
        reportId: report && report.reportId,
        checks: selectedCheckboxesId.map((id) => {
          return {
            reason: {
              id: id,
            },
            passed: true,
          };
        }),
        reviewComment: commentValue,
      })
    ).then(() => {
      setSelectedCheckboxId(selectedCheckboxesId);
      setCommentValue("");
      setIsOpen(false);
    });
  };

  return (
    <div
      className={clsx(
        "report__criterias_btn",
        isOpen && "report__criterias_activeBtn"
      )}
      onClick={handleOpenCriteriasCheck}
    >
      <span>Критерии проверки</span>
      {isOpen ? (
        <OpenEyeIcon className="eye__icon" />
      ) : (
        <ClosedEyeIcon className="eye__icon" />
      )}
      <div
        className={clsx(
          "criterias__popup",
          isOpen && "criterias__popup_active"
        )}
      >
        <div className="criterias__popup_content" onClick={handlePopupClick}>
          <div className="criterias__list_block">
            <div className="criterias__list_elem">
              <label className="checkbox__container">
                <input
                  type="checkbox"
                  checked={
                    (isCriteriasListExist && isAllCheckboxesChecked) || false
                  }
                  value={0}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
              </label>
              Выбрать все
            </div>
            {criteriasList &&
              criteriasList.map((item: any, index: number) => (
                <div key={index} className="criterias__list_elem">
                  <label className="checkbox__container">
                    <input
                      checked={selectedCheckboxesId.includes(item.reason.id)}
                      onChange={handleCheckboxChange}
                      value={item.reason.id}
                      name={item.reason.name}
                      type="checkbox"
                    />
                    <span className="checkmark"></span>
                  </label>
                  {item.reason.name}
                </div>
              ))}
          </div>
          {isCriteriasListExist ? (
            <>
              <span className="popup__bold_text">Комментарии к проверке:</span>
              <textarea
                className="criterias__comment_textfield"
                onChange={handleChangeComment}
                value={commentValue}
              ></textarea>
              <button
                className="criterias__download_btn"
                onClick={handleClickCheckBtn}
              >
                Проверка завершена
              </button>
            </>
          ) : (
            <span className="empty__list_message">
              В настоящий момент нет ни одного критерия проверки.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CriteriasPopup;
