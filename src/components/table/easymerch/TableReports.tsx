import { ChangeEvent, useEffect, useState, FC } from "react";
import { useDispatch, useSelector } from "react-redux";

import clsx from "clsx";

import { reducerReportsInputValues } from "../../../redux/reducer/easymerch/reducers/reducerReports";
import { actionGetReports } from "../../../redux/action/easymerch/actionReports";
import { AppDispatch } from "../../../redux/reducer/store";

import LimitSelect from "../../custom/limitSelect/limitSelect";
import Pagination from "../../pagination/pagination";
import Loader from "../../custom/loader/loader";

import "../table.scss";

const IS_VISIBLE_SIDEBAR = process.env.REACT_APP_IS_VISIBLE_SIDEBAR;

const TableReports: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { reports, reportsCount, limit, offset, reportsInputValues } =
    useSelector((state: any) => state.easymerch.reports);
  const { isOpenSidebar } = useSelector((state: any) => state.user.user);

  const [isInputChange, setIsInputChange] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);

  const actualLimit =
    JSON.parse(localStorage.getItem("pageLimit") as string) || limit;

  useEffect(() => {
    dispatch(actionGetReports(actualLimit, offset));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleDocumentClick = () => {
      if (reportsInputValues["ids"][0] === "" || undefined) {
        dispatch(reducerReportsInputValues({ ...reportsInputValues, ids: [] }));
      }

      dispatch(actionGetReports(limit, 0));
      setIsInputChange(false);
    };

    if (isInputChange) {
      document.addEventListener("click", handleDocumentClick);

      return () => {
        document.removeEventListener("click", handleDocumentClick);
      };
    } else
      return () => {
        document.removeEventListener("click", handleDocumentClick);
      };
  }, [dispatch, isInputChange, limit, reportsInputValues]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    dispatch(
      reducerReportsInputValues({
        ...reportsInputValues,
        [name]: name === "ids" ? [value] : value,
      })
    );

    setIsInputChange(true);
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      if (reportsInputValues["ids"][0] === "" || undefined) {
        dispatch(reducerReportsInputValues({ ...reportsInputValues, ids: [] }));
      }

      dispatch(actionGetReports(limit, 0));
      setIsInputChange(false);
    }
  };

  const handleChange = (newLimit: number, newOffset: number) => {
    setIsPending(true);
    dispatch(actionGetReports(newLimit, newOffset)).then(() => {
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
        {(!reports || isPending) && <Loader />}
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
            <thead>
              <tr>
                <th>
                  <div className="filter__block">
                    <input
                      value={reportsInputValues.ids}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder=" "
                      type="text"
                      name="ids"
                      id="id"
                    />
                    <label>ID</label>
                  </div>
                </th>
                <th>
                  <span className="filter__title">Описание</span>
                </th>
                <th>
                  <div className="filter__block">
                    <input
                      value={reportsInputValues.emId}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder=" "
                      type="text"
                      name="emId"
                      id="emId"
                    />
                    <label>ID EM</label>
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <input
                      value={reportsInputValues.emName}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder=" "
                      name="emName"
                      id="emName"
                      type="text"
                    />
                    <label>Название EM</label>
                  </div>
                </th>
                <th>
                  <span className="filter__title">Системный EM</span>
                </th>
                <th>
                  <span className="filter__title">Активный EM</span>
                </th>
                <th>
                  <div className="filter__block">
                    <input
                      value={reportsInputValues.emEngineName}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      name="emEngineName"
                      id="emEngineName"
                      placeholder=" "
                      type="text"
                    />
                    <label>Имя параметра</label>
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <input
                      value={reportsInputValues.emEngineCode}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      name="emEngineCode"
                      id="emEngineCode"
                      placeholder=" "
                      type="text"
                    />
                    <label>Код параметра</label>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {reports &&
                reports.map((report: any) => {
                  return (
                    <tr key={report.id}>
                      <td>{report.id}</td>
                      <td>{report.data?.description}</td>
                      <td>{report.data.emId}</td>
                      <td>{report.data.name}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={report.data.isSystem}
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={report.data.enabled}
                          disabled
                        />
                      </td>
                      <td>{report.data.engineName}</td>
                      <td>{report.data.engineCode}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="pagination__count">Всего: {reportsCount}</div>
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
            count={reportsCount}
            limit={actualLimit}
          />
        </div>
      </div>
    </>
  );
};

export default TableReports;
