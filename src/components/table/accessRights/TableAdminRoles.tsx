import { FC, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import clsx from "clsx";

import { actionGetRoles } from "../../../redux/action/accessRights/actionRoles";
import { AppDispatch } from "../../../redux/reducer/store";

import RolesModal from "../../rolesModal/rolesModal";
import Loader from "../../custom/loader/loader";

import "../table.scss";

const IS_VISIBLE_SIDEBAR = process.env.REACT_APP_IS_VISIBLE_SIDEBAR;

const TableAdminRoles: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { roles, rolesCount } = useSelector((state: any) => state.roles.roles);
  const { isOpenSidebar } = useSelector((state: any) => state.user.user);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [roleClaims, setRoleClaims] = useState<any>();
  const [roleId, setRoleId] = useState<number>();

  const handleCloseModal = useCallback(() => {
    dispatch(actionGetRoles());
    setIsOpenModal(false);
    setModalTitle("");
  }, [dispatch]);

  useEffect(() => {
    dispatch(actionGetRoles());
  }, [dispatch]);

  useEffect(() => {
    const handleDocumentKeydown = (event: any) => {
      if (event.keyCode === 27) {
        handleCloseModal();
      }
    };

    document.addEventListener("keydown", handleDocumentKeydown);
  }, [handleCloseModal]);

  const handleOpenModal = (name: string, id: number, claim: number) => {
    setIsOpenModal(true);
    setRoleClaims(claim);
    setModalTitle(name);
    setRoleId(id);
  };

  return (
    <>
      <div className="loader__wrapper">{!roles && <Loader />}</div>
      <div
        className={clsx(
          JSON.parse(IS_VISIBLE_SIDEBAR as string) &&
            isOpenSidebar &&
            "active__table",
          !isOpenSidebar && "closed__table",
          "table"
        )}
      >
        <div className="table__wrapper">
          <table>
            <thead className="accessRights__thead">
              <tr>
                <th>Название</th>
                <th>Архив</th>
                <th>Кол-во клейм</th>
              </tr>
            </thead>
            <tbody>
              {roles &&
                roles.map((role: any, index: number) => (
                  <tr
                    onClick={() =>
                      handleOpenModal(
                        role.role.name,
                        role.role.id,
                        role.claimsCount
                      )
                    }
                    className="active__link_tr"
                    key={index}
                  >
                    <td>{role.role?.name}</td>
                    <td>undefined</td>
                    <td>{role.claimsCount}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="pagination__count">Всего: {rolesCount}</div>
        </div>
      </div>
      {isOpenModal && (
        <RolesModal
          onClose={handleCloseModal}
          claims={roleClaims}
          title={modalTitle}
          id={roleId}
        />
      )}
    </>
  );
};

export default TableAdminRoles;
