import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

import { reducerGetSettings } from "../../../redux/reducer/tunder/reducers/reducerSettings";
import { generateStyles } from "../../../utils/generateToastStyles";
import { AppDispatch } from "../../../redux/reducer/store";
import {
  actionPostSettings,
  actionGetSettings,
} from "../../../redux/action/tunder/actionSettings";

import ToastPopup from "../../custom/toastPopup/toastPopup";
import Loader from "../../custom/loader/loader";

import Delete from "../../../assets/images/delete.png";

import "../table.scss";

const TableSettings: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { settings, limit, offset } = useSelector(
    (state: any) => state.tunder.settings
  );

  const [isCorrectEmail, setIsCorrectEmail] = useState(false);
  const [isEmailDelete, setIsEmailDelete] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  const [isEmailUsed, setIsEmailUsed] = useState(false);
  const [inputEmail, setInputEmail] = useState("");

  useEffect(() => {
    dispatch(actionGetSettings(limit, offset));
  }, [dispatch, limit, offset]);

  useEffect(() => {
    const toastInfo = {
      isSuccess: false,
      title: "Некорректный адрес электронной почты!",
    };

    if (isCorrectEmail) {
      toastInfo.isSuccess = true;
      toastInfo.title = "Почта добавлена!";
    } else if (isEmailUsed) {
      toastInfo.title = "Данная почта уже используется!";
    } else if (isEmailDelete) {
      toastInfo.isSuccess = true;
      toastInfo.title = "Почта успешно удалена!";
    }

    if (isCorrectEmail || isEmailError || isEmailUsed || isEmailDelete) {
      toast.dismiss();
      toast(
        (t) => (
          <ToastPopup
            title={toastInfo.title}
            isSuccess={toastInfo.isSuccess}
            toast={toast}
            t={t}
          />
        ),
        generateStyles(toastInfo.isSuccess)
      );
    }

    setIsCorrectEmail(false);
    setIsEmailDelete(false);
    setIsEmailError(false);
    setIsEmailUsed(false);
  }, [dispatch, isCorrectEmail, isEmailDelete, isEmailError, isEmailUsed]);

  const removeSettings = (outlet: any) => {
    const newSettingsArr = settings.filter((item: any) => item !== outlet);
    dispatch(actionPostSettings([...newSettingsArr]));
    dispatch(reducerGetSettings({ data: [...newSettingsArr], limit, offset }));
    setIsEmailDelete(true);
  };

  const handleAddEmail = () => {
    if (inputEmail && isValidEmail(inputEmail)) {
      const isEmailAlreadyUsed = settings.includes(inputEmail);
      if (isEmailAlreadyUsed) {
        setIsEmailUsed(true);
      } else {
        setIsCorrectEmail(true);
        dispatch(actionPostSettings([...settings, inputEmail]));
        dispatch(
          reducerGetSettings({ data: [...settings, inputEmail], limit, offset })
        );
        setInputEmail("");
        setIsEmailUsed(false);
      }
    } else {
      setIsEmailError(true);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddEmail();
    }
  };

  const handleInputChange = (event: any) => {
    setInputEmail(event.target.value);
    setIsEmailUsed(false);
    setIsEmailError(false);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <>
      <div className="loader__wrapper">{!settings && <Loader />}</div>
      <span className="settings__title">Список почты для уведомлений</span>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000,
        }}
      />
      <div className="tunder__settings_table">
        <div className="tunder__settings_tableWrapper">
          <table>
            <thead className="tunder__thead">
              <tr>
                <th className="th__without_border">
                  <span className="filter__title">Email</span>
                </th>
                <th style={{ textAlign: "right" }}>
                  <span className="filter__title"></span>
                </th>
              </tr>
            </thead>
            <tbody>
              {settings &&
                settings.map((outlet: any, index: any) => {
                  return (
                    <tr key={index}>
                      <td>{outlet}</td>
                      <td style={{ textAlign: "right" }}>
                        <img
                          onClick={() => removeSettings(outlet)}
                          className="table-button-img"
                          src={Delete}
                          alt=""
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <table>
          <tfoot>
            <tr>
              <td>
                <input
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="input__email"
                  value={inputEmail}
                  name="email"
                  type="text"
                />
              </td>
              <td style={{ textAlign: "right" }}>
                <button className="table-button" onClick={handleAddEmail}>
                  Добавить адрес
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
};

export default TableSettings;
