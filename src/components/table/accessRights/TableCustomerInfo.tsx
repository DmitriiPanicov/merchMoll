import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  actionUpdateClientContracts,
  actionGetClientSettings,
} from "../../../redux/action/accessRights/actionCustomersSettings";
import { actionGetCustomersList } from "../../../redux/action/accessRights/actionCustomersList";
import { AppDispatch } from "../../../redux/reducer/store";

import Loader from "../../custom/loader/loader";

import "../table.scss";

const TableCustomerInfo: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const {
    allContractsForUpdate,
    clientContractsLength,
    clientContractsList,
    activeContracts,
    customers,
    limit,
    pages,
  } = useSelector((state: any) => state.roles.customerList);

  const [selectedCheckboxes, setSelectedCheckboxes] = useState<any>([]);
  const [isHeaderCheckboxChecked, setIsHeaderCheckboxChecked] =
    useState<boolean>(false);

  useEffect(() => {
    dispatch(actionGetClientSettings(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (activeContracts) {
      setSelectedCheckboxes(activeContracts);
    }
  }, [activeContracts]);

  useEffect(() => {
    if (!customers) {
      dispatch(actionGetCustomersList(limit, pages));
    }
  }, [customers, dispatch, limit, pages]);

  useEffect(() => {
    if (clientContractsLength !== selectedCheckboxes.length) {
      setIsHeaderCheckboxChecked(false);
    }
  }, [clientContractsLength, selectedCheckboxes]);

  const handleChangeCheckbox = (contractId: number) => {
    if (selectedCheckboxes.includes(contractId)) {
      dispatch(
        actionUpdateClientContracts(
          id,
          selectedCheckboxes
            .filter((elem: any) => elem !== contractId)
            .map((selectedId: number) => ({ id: selectedId }))
        )
      );
    } else {
      dispatch(
        actionUpdateClientContracts(id, [
          ...selectedCheckboxes.map((selectedId: number) => ({
            id: selectedId,
          })),
          { id: contractId },
        ])
      );
    }
  };

  const handleSelectAllCheckboxes = () => {
    setIsHeaderCheckboxChecked(!isHeaderCheckboxChecked);

    dispatch(
      actionUpdateClientContracts(
        id,
        !isHeaderCheckboxChecked ? allContractsForUpdate : []
      )
    );
  };

  return (
    <>
      <div className="loader__wrapper">
        {!clientContractsList && <Loader />}
      </div>
      <div className="contracts__table">
        <div className="table__wrapper">
          <table>
            <thead className="clients__info_thead">
              <tr>
                <th>
                  {clientContractsList && (
                    <input
                      onChange={handleSelectAllCheckboxes}
                      checked={isHeaderCheckboxChecked}
                      type="checkbox"
                    />
                  )}
                </th>
                <th>Контракты</th>
              </tr>
            </thead>
            <tbody>
              {clientContractsList &&
                clientContractsList.map((elem: any, index: number) => (
                  <tr key={index}>
                    <td>
                      <input
                        onChange={() =>
                          handleChangeCheckbox(elem?.contract?.id)
                        }
                        checked={
                          elem.active ||
                          selectedCheckboxes.includes(elem?.contract?.id)
                        }
                        type="checkbox"
                      />
                    </td>
                    <td>{elem?.contract?.name}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TableCustomerInfo;
