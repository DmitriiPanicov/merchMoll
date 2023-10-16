import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  actionUpdateClientRegions,
  actionGetClientSettings,
} from "../../../redux/action/accessRights/actionCustomersSettings";
import { actionGetCustomersList } from "../../../redux/action/accessRights/actionCustomersList";
import { AppDispatch } from "../../../redux/reducer/store";

import Loader from "../../custom/loader/loader";

import "../table.scss";

const TableCustomerRegions: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const {
    clientRegionsList,
    allRegionsForUpdate,
    activeRegions,
    customers,
    limit,
    pages,
  } = useSelector((state: any) => state.roles.customerList);

  const [isHeaderCheckboxChecked, setIsHeaderCheckboxChecked] =
    useState<boolean>(false);
  const [selectedRegions, setSelectedRegions] = useState<any>([]);

  useEffect(() => {
    if (!clientRegionsList) {
      dispatch(actionGetClientSettings(id));
    }
  }, [clientRegionsList, dispatch, id]);

  useEffect(() => {
    if (!customers) {
      dispatch(actionGetCustomersList(limit, pages));
    }
  }, [customers, dispatch, limit, pages]);

  useEffect(() => {
    if (activeRegions) {
      setSelectedRegions(activeRegions);
    }
  }, [activeRegions]);

  const handleHeaderCheckboxChange = () => {
    setIsHeaderCheckboxChecked(!isHeaderCheckboxChecked);

    dispatch(
      actionUpdateClientRegions(
        id,
        !isHeaderCheckboxChecked ? allRegionsForUpdate : []
      )
    );
  };

  const handleChangeCheckbox = (regionId: number) => {
    const filteredClientRegions = selectedRegions.includes(regionId)
      ? clientRegionsList &&
        clientRegionsList.filter((item: any) =>
          selectedRegions
            ?.filter((id: any) => id !== regionId)
            ?.includes(item.region.id)
        )
      : clientRegionsList &&
        clientRegionsList.filter((item: any) =>
          [...selectedRegions, regionId]?.includes(item.region.id)
        );

    dispatch(
      actionUpdateClientRegions(
        id,
        filteredClientRegions.map((elem: any) => ({
          region: {
            id: elem.region.id,
          },
          areas: elem.areas.map((area: any) => ({
            area: {
              id: area.area.id,
            },
          })),
        }))
      )
    );
  };

  return (
    <>
      <div className="loader__wrapper">{!clientRegionsList && <Loader />}</div>
      <div className="contracts__table">
        <div className="table__wrapper">
          <table>
            <thead className="clients__info_thead">
              <tr>
                <th>
                  {clientRegionsList && (
                    <input
                      onChange={handleHeaderCheckboxChange}
                      checked={isHeaderCheckboxChecked}
                      type="checkbox"
                    />
                  )}
                </th>
                <th>Регионы</th>
              </tr>
            </thead>
            <tbody>
              {clientRegionsList &&
                clientRegionsList.map((elem: any) => (
                  <tr key={elem.region.id}>
                    <td>
                      <input
                        onChange={() => handleChangeCheckbox(elem.region.id)}
                        checked={
                          elem.active ||
                          selectedRegions.includes(elem.region.id)
                        }
                        type="checkbox"
                      />
                    </td>
                    <td>{elem.region.name}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TableCustomerRegions;
