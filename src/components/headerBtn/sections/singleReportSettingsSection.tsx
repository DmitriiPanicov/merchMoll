import { FC, useEffect, useState } from "react";
import { Draggable, Droppable, DragDropContext } from "react-beautiful-dnd";
import { useSelector } from "react-redux";

import styles from "../headerBtn.module.scss";

interface IProps {
  setReorderedReportOptions: any;
  isCheckedFullInfo: boolean;
  setSelectedReportTabs: any;
  setIsCheckedFullInfo: any;
  selectedReportTabs: any;
}

const SingleReportSettingsSection: FC<IProps> = ({
  setReorderedReportOptions,
  setSelectedReportTabs,
  setIsCheckedFullInfo,
  selectedReportTabs,
  isCheckedFullInfo,
}) => {
  const { initialCustomerReportOptions, reorderedOptions } = useSelector(
    (state: any) => state.userSingleReport.userSingleReport
  );

  const [filteredOptions, setFilteredOptions] = useState<any>(
    reorderedOptions || initialCustomerReportOptions
  );

  useEffect(() => {
    filteredOptions && setReorderedReportOptions(filteredOptions);
  }, [filteredOptions, setReorderedReportOptions]);

  const handleChangeCheckbox = (name: string) => {
    if (name === "mainInfo") return;

    const updatedSettings = selectedReportTabs.includes(name)
      ? selectedReportTabs.filter((elem: any) => elem !== name)
      : [...selectedReportTabs, name];

    setSelectedReportTabs(updatedSettings);
    setIsCheckedFullInfo(false);
  };

  const handleChangeFullInfoCheckbox = () => {
    if (!isCheckedFullInfo) {
      setSelectedReportTabs([
        "mainInfo",
        "geo",
        "photos",
        "files",
        "planogramms",
        "cv",
        "skus",
        "actionsTT",
        "actions",
        "skuCv",
        "review",
        "rate",
        "history",
      ]);
    } else {
      setSelectedReportTabs(["mainInfo"]);
    }

    setIsCheckedFullInfo(!isCheckedFullInfo);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const optionsToUpdate = Array.from(filteredOptions);

    const [movedOption] = optionsToUpdate.splice(result.source.index, 1);
    optionsToUpdate.splice(result.destination.index, 0, movedOption);

    setReorderedReportOptions(optionsToUpdate);
    setFilteredOptions(optionsToUpdate);
  };

  const handleResetOrder = () => {
    setFilteredOptions(initialCustomerReportOptions);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={styles.settings__block_info}>
        <Droppable droppableId="options">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={styles.check__list_block}
            >
              {filteredOptions?.map((option: any, index: number) => (
                <Draggable
                  draggableId={index.toString()}
                  index={index}
                  key={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={styles.check__list_elem}
                    >
                      <label className={styles.checkbox__container}>
                        <input
                          checked={selectedReportTabs.includes(option.value)}
                          type="checkbox"
                          onChange={() => handleChangeCheckbox(option.value)}
                        />
                        <span className={styles.multi__reason_checkmark}></span>
                      </label>
                      {option.label}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <div className={styles.check__list_elem}>
                <label className={styles.checkbox__container}>
                  <input
                    type={"checkbox"}
                    onChange={handleChangeFullInfoCheckbox}
                    checked={isCheckedFullInfo}
                  />
                  <span className={styles.multi__reason_checkmark}></span>
                </label>
                Полная информация
              </div>
              <button
                className={styles.reset__order_btn}
                onClick={handleResetOrder}
              >
                Сбросить расположение блоков
              </button>
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default SingleReportSettingsSection;
