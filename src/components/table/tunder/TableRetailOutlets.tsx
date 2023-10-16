import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

import clsx from "clsx";

import { reducerRetailOutletsStatus } from "../../../redux/reducer/tunder/reducers/reducerRetailOutlets";
import { generateStyles } from "../../../utils/generateToastStyles";
import { AppDispatch } from "../../../redux/reducer/store";
import {
  actionUpdateRetailOutlets,
  actionGetRetailOutlets,
} from "../../../redux/action/tunder/actionRetailOutlets";

import LimitSelect from "../../custom/limitSelect/limitSelect";
import ToastPopup from "../../custom/toastPopup/toastPopup";
import Pagination from "../../pagination/pagination";
import Loader from "../../custom/loader/loader";

import "../table.scss";

const IS_VISIBLE_SIDEBAR = process.env.REACT_APP_IS_VISIBLE_SIDEBAR;

const TableRetailOutlets: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { retailOutlets, retailOutletsCount, offset, status, limit } =
    useSelector((state: any) => state.tunder.retailOutlets);
  const { isOpenSidebar } = useSelector((state: any) => state.user.user);

  const [activeCheckboxes, setActiveCheckboxes] = useState<boolean[]>(
    retailOutlets?.map(() => true) || []
  );

  const [isPending, setIsPending] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);

  const actualLimit =
    JSON.parse(localStorage.getItem("pageLimit") as string) || limit;

  useEffect(() => {
    dispatch(actionGetRetailOutlets(actualLimit, offset));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === 200) {
      toast(
        (t) => (
          <ToastPopup
            title="Файл успешно загружен!"
            isSuccess={true}
            toast={toast}
            t={t}
          />
        ),
        generateStyles(true)
      );
    } else if (status === 0) {
      toast(
        (t) => (
          <ToastPopup
            title="Ошибка загрузки файлов!"
            isSuccess={false}
            toast={toast}
            t={t}
          />
        ),
        generateStyles()
      );
    }

    dispatch(reducerRetailOutletsStatus(null));
  }, [dispatch, status]);

  useEffect(() => {
    if (retailOutlets && retailOutlets.length > 0) {
      setActiveCheckboxes(new Array(retailOutlets.length).fill(true));
    }
  }, [retailOutlets]);

  const handleChange = (newLimit: number, newOffset: number) => {
    setIsPending(true);
    dispatch(actionGetRetailOutlets(newLimit, newOffset)).then(() => {
      setIsPending(false);
    });
    localStorage.setItem("pageLimit", JSON.stringify(newLimit));
  };

  const handleChangeLimits = (option: any) => {
    handleChange(option.value, 0);
    setCurrentPage(1);
    setStartPage(1);
  };

  const handleCheckboxChange = (posId: number) => {
    const updatedCheckboxes = { ...activeCheckboxes };

    updatedCheckboxes[posId] = !updatedCheckboxes[posId];
    setActiveCheckboxes(updatedCheckboxes);

    const shopCode = retailOutlets.find(
      (outlet: any) => outlet.posId === posId
    )?.shopCode;

    if (shopCode !== undefined) {
      const updateData = {
        posId,
        shopCode,
        active: !updatedCheckboxes[posId],
      };
      dispatch(actionUpdateRetailOutlets(updateData));
    }
  };

  return (
    <>
      <div className="loader__wrapper">
        {(!retailOutlets || isPending) && <Loader />}
      </div>
      <div
        className={clsx(
          JSON.parse(IS_VISIBLE_SIDEBAR as string) &&
            isOpenSidebar &&
            "active__table",
          !isOpenSidebar && "closed__table",
          "table"
        )}
      >
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 5000,
          }}
        />
        <div className="table__wrapper">
          <table>
            <thead className="tunder__thead">
              <tr className="tunder__outlets_tr">
                <th>
                  <span className="filter__title">Активна</span>
                </th>
                <th>
                  <span className="filter__title">Код Тандер</span>
                </th>
                <th>
                  <span className="filter__title">ID TT</span>
                </th>
                <th>
                  <span className="filter__title">Адрес</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {retailOutlets &&
                retailOutlets.map((outlet: any) => (
                  <tr key={outlet.posId}>
                    <td>
                      <input
                        onChange={() => handleCheckboxChange(outlet.posId)}
                        defaultChecked={outlet.active}
                        type="checkbox"
                      />
                    </td>
                    <td>{outlet.shopCode}</td>
                    <td>{outlet.posId}</td>
                    <td>{outlet.address}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="pagination__count">Всего: {retailOutletsCount}</div>
          <div className="pagination__str">
            <span>Отображать строки</span>
            <LimitSelect limit={actualLimit} propsChange={handleChangeLimits} />
          </div>
          <Pagination
            setCurrentPage={setCurrentPage}
            setStartPage={setStartPage}
            handleChange={handleChange}
            count={retailOutletsCount}
            currentPage={currentPage}
            startPage={startPage}
            limit={actualLimit}
          />
        </div>
      </div>
    </>
  );
};

export default TableRetailOutlets;
