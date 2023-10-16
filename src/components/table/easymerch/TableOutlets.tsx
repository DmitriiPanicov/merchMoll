import { KeyboardEvent, ChangeEvent, useEffect, useState, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

import clsx from "clsx";

import {
  reducerOutletsInputValues,
  reducerUnloadOutlets,
} from "../../../redux/reducer/easymerch/reducers/reducerOutlets";
import { actionGetOutlets } from "../../../redux/action/easymerch/actionOutlets";
import { generateStyles } from "../../../utils/generateToastStyles";
import { AppDispatch } from "../../../redux/reducer/store";

import LimitSelect from "../../custom/limitSelect/limitSelect";
import ToastPopup from "../../custom/toastPopup/toastPopup";
import Pagination from "../../pagination/pagination";
import Loader from "../../custom/loader/loader";

import "../table.scss";

const IS_VISIBLE_SIDEBAR = process.env.REACT_APP_IS_VISIBLE_SIDEBAR;

const TableOutlets: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { outletsInputValues, outletsCount, outlets, offset, status, limit } =
    useSelector((state: any) => state.easymerch.outlets);
  const { isOpenSidebar } = useSelector((state: any) => state.user.user);

  const [isInputChange, setIsInputChange] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);

  const actualLimit =
    JSON.parse(localStorage.getItem("pageLimit") as string) || limit;

  useEffect(() => {
    dispatch(actionGetOutlets(actualLimit, offset));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === 200) {
      toast.dismiss();
      toast(
        (t) => (
          <ToastPopup
            title="Торговые точки успешно выгружены!"
            isSuccess={true}
            toast={toast}
            t={t}
          />
        ),
        generateStyles(true)
      );
    } else if (status === 0) {
      toast.dismiss();
      toast(
        (t) => (
          <ToastPopup
            title="При выгрузке торговых точек произошла ошибка!"
            isSuccess={false}
            toast={toast}
            t={t}
          />
        ),
        generateStyles()
      );
    }

    dispatch(reducerUnloadOutlets({ data: {}, status: null }));
  }, [dispatch, status]);

  useEffect(() => {
    const handleDocumentClick = () => {
      dispatch(actionGetOutlets(limit, 0));
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
  }, [isInputChange, dispatch, limit]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch(
      reducerOutletsInputValues({ ...outletsInputValues, [name]: value })
    );
    setIsInputChange(true);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      dispatch(actionGetOutlets(limit, 0));
      setIsInputChange(false);
    }
  };

  const handleChange = (newLimit: number, newOffset: number) => {
    setIsPending(true);
    dispatch(actionGetOutlets(newLimit, newOffset)).then(() => {
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
        {(!outlets || isPending) && <Loader />}
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
            <thead>
              <tr>
                <th>
                  <div className="filter__block">
                    <input
                      value={outletsInputValues.idMol}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder=" "
                      name="idMol"
                      type="text"
                      id="id"
                    />
                    <label>ID MOL</label>
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <input
                      value={outletsInputValues.molNetwork}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      name="molNetwork"
                      placeholder=" "
                      id="network"
                      type="text"
                    />
                    <label>Сеть</label>
                  </div>
                </th>
                <th className="outlets__city_title">
                  <span>Город</span>
                </th>
                <th>
                  <div className="filter__block">
                    <input
                      value={outletsInputValues.molAddress}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      name="molAddress"
                      placeholder=" "
                      id="address"
                      type="text"
                    />
                    <label>Адрес</label>
                  </div>
                </th>
                <th>
                  <div className="filter__block"></div>
                  <span className="filter__title">Тип обслуживания</span>
                </th>
                <th>
                  <div className="filter__block">
                    <input
                      value={outletsInputValues.idEm}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder=" "
                      id="address"
                      name="idEm"
                      type="text"
                    />
                    <label>ID EM</label>
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <input
                      value={outletsInputValues.emNetwork}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      name="emNetwork"
                      placeholder=" "
                      id="address"
                      type="text"
                    />
                    <label>Сеть EM</label>
                  </div>
                </th>
                <th>
                  <div className="filter__block">
                    <input
                      value={outletsInputValues.emAddress}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      name="emAddress"
                      placeholder=" "
                      id="address"
                      type="text"
                    />
                    <label>Адрес EM</label>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {outlets &&
                outlets.map((outlet: any) => {
                  return (
                    <tr key={outlet.id}>
                      <td>{outlet.idMol}</td>
                      <td>{outlet.molNetwork}</td>

                      <td>{outlet.city}</td>
                      <td>{outlet.molAddress}</td>
                      <td>
                        {outlet.emPosData.shop_std_param_service_type_name}
                      </td>
                      <td>{outlet.emPosData.emId}</td>
                      <td>{outlet.emPosData.shop_network_name}</td>
                      <td>{outlet.emPosData.shop_name}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="pagination__count">Всего: {outletsCount}</div>
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
            count={outletsCount}
            limit={actualLimit}
          />
        </div>
      </div>
    </>
  );
};

export default TableOutlets;
