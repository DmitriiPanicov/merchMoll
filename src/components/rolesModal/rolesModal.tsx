import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Tooltip } from "antd";
import clsx from "clsx";

import {
  actionUpdateClaimDescription,
  actionGetRolesRights,
  actionDeleteRight,
} from "../../redux/action/accessRights/actionRoles";
import { actionAddRight } from "../../redux/action/accessRights/actionRoles";
import { AppDispatch } from "../../redux/reducer/store";

import Blackout from "../custom/blackout/blackout";

import { ReactComponent as DirectionIcon } from "../../assets/icons/direction.svg";
import { ReactComponent as QuestionIcon } from "../../assets/icons/question.svg";
import { ReactComponent as PlusIcon } from "../../assets/icons/plus.svg";
import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg";
import Close from "../../assets/icons/close.svg";

import styles from "./rolesModal.module.scss";

interface IProps {
  claims: number;
  title: string;
  onClose: any;
  id: any;
}

const RolesModal: FC<IProps> = ({ onClose, title, id }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { roleRights, allRolesRights } = useSelector(
    (state: any) => state.roles.roles
  );

  const [selectedUsedRoles, setSelectedUsedRoles] = useState<number[]>([]);
  const [tooltipEditOpend, setTooltipEditOpend] = useState<boolean>(false);
  const [selectedAllRoles, setSelectedAllRoles] = useState<number[]>([]);
  const [tooltipEditValue, setTooltipEditValue] = useState<string>("");
  const [usedRolesSearch, setUsedRolesSearch] = useState<string>("");
  const [allRolesSearch, setAllRolesSearch] = useState<string>("");

  const filteredUsedRoles =
    roleRights &&
    roleRights?.filter((option: any) =>
      option?.role?.name
        ?.toLowerCase()
        ?.includes(usedRolesSearch?.toLowerCase())
    );

  const filteredAllRoles =
    allRolesRights &&
    allRolesRights?.filter((option: any) =>
      option?.role?.name?.toLowerCase()?.includes(allRolesSearch?.toLowerCase())
    );

  useEffect(() => {
    dispatch(actionGetRolesRights(id));
  }, [dispatch, id]);

  const handleAllRoleClick = (roleId: number) => {
    if (selectedAllRoles.includes(roleId)) {
      setSelectedAllRoles(selectedAllRoles.filter((id) => id !== roleId));
    } else {
      setSelectedAllRoles([...selectedAllRoles, roleId]);
    }
  };

  const handleUsedRoleClick = (roleId: number) => {
    if (selectedUsedRoles.includes(roleId)) {
      setSelectedUsedRoles(selectedUsedRoles.filter((id) => id !== roleId));
    } else {
      setSelectedUsedRoles([...selectedUsedRoles, roleId]);
    }
  };

  const handleAddSelectedRoles = () => {
    if (selectedAllRoles.length > 0) {
      const filteredRoles = allRolesRights
        .filter((roleObj: any) => selectedAllRoles.includes(roleObj.role.id))
        .map((elem: any) => elem.role);

      dispatch(actionAddRight(id, filteredRoles));
      setSelectedAllRoles([]);
    }
  };

  const handleDeleteSelectedRoles = () => {
    if (selectedUsedRoles.length > 0) {
      const filteredRoles = roleRights
        .filter((roleObj: any) => selectedUsedRoles.includes(roleObj.role.id))
        .map((elem: any) => elem.role);

      dispatch(actionDeleteRight(id, filteredRoles));
      setSelectedUsedRoles([]);
    }
  };

  const handleClickTooltip = (event: any) => {
    event.stopPropagation();
  };

  const openEditClaimDescription = (claimDescription: any) => {
    setTooltipEditValue(claimDescription);
    setTooltipEditOpend(true);
  };

  const handleEditClaimDescription = (claimId: any, value: any) => {
    dispatch(
      actionUpdateClaimDescription(id, {
        claim: {
          id: claimId,
        },
        description: value,
      })
    );
    setTooltipEditOpend(false);
  };

  return (
    <Blackout onClose={onClose}>
      <div
        onClick={(event: any) => event.stopPropagation()}
        className={styles.modal}
      >
        <div className={styles.title__block}>
          <span>{title}</span>
          <img
            style={{ cursor: "pointer" }}
            onClick={onClose}
            src={Close}
            alt="close"
          />
        </div>
        <div className={styles.roles__block}>
          <div className={styles.button__block}>
            <div className={styles.roles__table}>
              <div className={styles.roles__title_block}>
                <span>Доступные права</span>
              </div>
              <input
                onChange={(e) => setAllRolesSearch(e?.target?.value)}
                className={styles.roles__search}
                placeholder="Поиск..."
                type="text"
              />
              <div className={styles.roles__list}>
                {filteredAllRoles &&
                  filteredAllRoles.map((elem: any, index: number) => (
                    <>
                      <div
                        onClick={() => handleAllRoleClick(elem.role.id)}
                        className={clsx(
                          styles.role__elem,
                          selectedAllRoles.includes(elem.role.id) &&
                            styles.active__role
                        )}
                        key={index}
                      >
                        <span>{elem.role.name}</span>
                        <Tooltip
                          title={
                            <div
                              className={styles.tooltip__block}
                              onClick={handleClickTooltip}
                              onMouseLeave={() => {
                                setTooltipEditValue("");
                                setTooltipEditOpend(false);
                              }}
                            >
                              {tooltipEditOpend ? (
                                <>
                                  <textarea
                                    maxLength={48}
                                    className={styles.tooltip__input}
                                    value={tooltipEditValue}
                                    onChange={(e) => {
                                      setTooltipEditValue(e.target.value);
                                    }}
                                  />
                                  <PlusIcon
                                    className={styles.tooltip__icon}
                                    onClick={() =>
                                      handleEditClaimDescription(
                                        elem.role.id,
                                        tooltipEditValue
                                      )
                                    }
                                  />
                                </>
                              ) : (
                                <>
                                  <p className={styles.tooltip__description}>
                                    {elem.description}
                                  </p>
                                  <EditIcon
                                    onClick={() => {
                                      openEditClaimDescription(
                                        elem.description
                                      );
                                    }}
                                    className={styles.tooltip__icon}
                                  />
                                </>
                              )}
                            </div>
                          }
                          color={"var(--main-color)"}
                          placement="right"
                        >
                          <QuestionIcon
                            className={clsx(
                              styles.role__elem_icon,
                              selectedAllRoles.includes(elem.role.id) &&
                                styles.active__role_icon
                            )}
                          />
                        </Tooltip>
                      </div>
                    </>
                  ))}
              </div>
            </div>
            <button
              className={clsx(
                styles.add__table_disabledButton,
                selectedAllRoles.length > 0 && styles.add__table_activeButton
              )}
              onClick={handleAddSelectedRoles}
            >
              Добавить выбранные
              <DirectionIcon className={styles.add__direction_icon} />
            </button>
          </div>
          <div className={styles.button__block}>
            <div className={styles.roles__table}>
              <div className={styles.roles__title_block}>
                <span>Назначенные права</span>
              </div>
              <input
                onChange={(e) => setUsedRolesSearch(e?.target?.value)}
                className={styles.roles__search}
                placeholder="Поиск..."
                type="text"
              />
              <div className={styles.roles__list}>
                {filteredUsedRoles &&
                  filteredUsedRoles.map((elem: any, index: number) => (
                    <div
                      onClick={() => handleUsedRoleClick(elem.role.id)}
                      className={clsx(
                        styles.role__elem,
                        selectedUsedRoles.includes(elem.role.id) &&
                          styles.active__role
                      )}
                      key={index}
                    >
                      <span>{elem.role.name}</span>
                      <Tooltip
                        title={
                          <div
                            className={styles.tooltip__block}
                            onClick={handleClickTooltip}
                            onMouseLeave={() => {
                              setTooltipEditValue("");
                              setTooltipEditOpend(false);
                            }}
                          >
                            {tooltipEditOpend ? (
                              <>
                                <textarea
                                  maxLength={48}
                                  className={styles.tooltip__input}
                                  value={tooltipEditValue}
                                  onChange={(e) => {
                                    setTooltipEditValue(e.target.value);
                                  }}
                                />
                                <PlusIcon
                                  className={styles.tooltip__icon}
                                  onClick={() =>
                                    handleEditClaimDescription(
                                      elem.role.id,
                                      tooltipEditValue
                                    )
                                  }
                                />
                              </>
                            ) : (
                              <>
                                <p className={styles.tooltip__description}>
                                  {elem.description}
                                </p>
                                <EditIcon
                                  onClick={() => {
                                    openEditClaimDescription(elem.description);
                                  }}
                                  className={styles.tooltip__icon}
                                />
                              </>
                            )}
                          </div>
                        }
                        color={"var(--main-color)"}
                        placement="right"
                      >
                        <QuestionIcon
                          className={clsx(
                            styles.role__elem_icon,
                            selectedAllRoles.includes(elem.role.id) &&
                              styles.active__role_icon
                          )}
                        />
                      </Tooltip>
                    </div>
                  ))}
                {!filteredUsedRoles && (
                  <span className={styles.empty__list_text}>
                    Нет назначенных прав
                  </span>
                )}
              </div>
            </div>
            <button
              className={clsx(
                styles.delete__table_disabledButton,
                selectedUsedRoles.length > 0 &&
                  styles.delete__table_activeButton
              )}
              onClick={handleDeleteSelectedRoles}
            >
              <DirectionIcon className={styles.delete__direction_icon} />
              Удалить выбранные
            </button>
          </div>
        </div>
      </div>
    </Blackout>
  );
};

export default RolesModal;
