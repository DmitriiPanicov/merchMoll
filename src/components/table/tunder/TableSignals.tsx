import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import clsx from "clsx";

import { actionGetSignals } from "../../../redux/action/tunder/actionSignals";
import { AppDispatch } from "../../../redux/reducer/store";

import LimitSelect from "../../custom/limitSelect/limitSelect";
import Pagination from "../../pagination/pagination";
import Loader from "../../custom/loader/loader";

import "../table.scss";

const IS_VISIBLE_SIDEBAR = process.env.REACT_APP_IS_VISIBLE_SIDEBAR;

const TableSignals: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { signals, signalsCount, offset, limit } = useSelector(
    (state: any) => state.tunder.signals
  );
  const { isOpenSidebar } = useSelector((state: any) => state.user.user);

  const [isPending, setIsPending] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);

  const actualLimit =
    JSON.parse(localStorage.getItem("pageLimit") as string) || limit;

  useEffect(() => {
    dispatch(actionGetSignals(actualLimit, offset));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (newLimit: number, newOffset: number) => {
    setIsPending(true);
    dispatch(actionGetSignals(newLimit, newOffset)).then(() => {
      setIsPending(false);
    });
    localStorage.setItem("pageLimit", JSON.stringify(newLimit));
  };

  const handleChangeLimits = (option: any) => {
    handleChange(option.value, 0);
    setCurrentPage(1);
    setStartPage(1);
  };

  return (
    <>
      <div className="loader__wrapper">
        {(!signals || isPending) && <Loader />}
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
        <div className="table__wrapper">
          <table>
            <thead className="tunder__thead">
              <tr>
                <th className="signals__date_cell">
                  <span className="filter__title">Дата</span>
                </th>
                <th>
                  <span className="filter__title">Контракт</span>
                </th>
                <th>
                  <span className="filter__title">Сотрудник</span>
                </th>
                <th>
                  <span className="filter__title">PLU</span>
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
                <th>
                  <span className="filter__title">Товар</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {signals &&
                signals.map((outlet: any) => {
                  return (
                    <tr key={outlet.id}>
                      <td>{outlet.date?.split("-")?.reverse()?.join(".")}</td>
                      <td>{outlet.contract}</td>
                      <td>{outlet.employee}</td>
                      <td>{outlet.productCode}</td>
                      <td>{outlet.id}</td>
                      <td>{outlet.shopCode}</td>
                      <td>{outlet.address}</td>
                      <td>{outlet.productName}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="pagination__count">Всего: {signalsCount}</div>
          <div className="pagination__str">
            <span>Отображать строки</span>
            <LimitSelect limit={actualLimit} propsChange={handleChangeLimits} />
          </div>
          <Pagination
            setCurrentPage={setCurrentPage}
            setStartPage={setStartPage}
            handleChange={handleChange}
            currentPage={currentPage}
            startPage={startPage}
            count={signalsCount}
            limit={actualLimit}
          />
        </div>
      </div>
    </>
  );
};

export default TableSignals;
