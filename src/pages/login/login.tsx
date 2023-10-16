import { FC, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Base64 } from "js-base64";
import jsSHA from "jssha";

import { reducerLoginStatus } from "../../redux/reducer/user/reducers/reducerUser";
import { actionCheckTokenValidity } from "../../redux/action/user/actionUser";
import { AppDispatch } from "../../redux/reducer/store";

import HidePassword from "../../assets/icons/hidePassword.svg";
import ShowPassword from "../../assets/icons/showPassword.svg";
import ArrowRight from "../../assets/icons/arrowRight.svg";
import Profile from "../../assets/icons/Profile.svg";
import Lock from "../../assets/icons/Lock.svg";

import styles from "./login.module.scss";

const Login: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { data, loginStatus } = useSelector((state: any) => state.user.user);

  const photoViewerInstance = document.querySelector(".photoviewer-modal");

  const [isVisiblePassword, setIsVisiblePassword] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [login, setLogin] = useState<string>("");

  useEffect(() => {
    if (photoViewerInstance) {
      photoViewerInstance.remove();
    }
  }, [photoViewerInstance]);

  useEffect(() => {
    if (loginStatus === 0) {
      setIsError(true);
    } else if (loginStatus === 200) {
      localStorage.setItem("token", "Basic " + data.token);
      localStorage.setItem("userData", JSON.stringify(data));
      window.location.reload();
      navigate("/reports");
      setIsError(false);
    }
  }, [data, loginStatus, navigate]);

  const handleInputChange = (event: any, setState: any) => {
    setState(event.target.value);
    setIsError(false);
  };

  const handleLogin = () => {
    const shaObj = new jsSHA("SHA-1", "TEXT", { encoding: "UTF8" });
    shaObj.update(password);
    const hashedPassword = shaObj.getHash("B64");

    const token = Base64.encode(login + ":" + hashedPassword);

    dispatch(actionCheckTokenValidity(token)).then(() => {
      dispatch(reducerLoginStatus(null));
    });
  };

  if (localStorage.getItem("token")) {
    return <Navigate to="/reports" />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.block}>
        <h1 className={styles.title}>Merch Online</h1>
        <div className={styles.input__block}>
          <img src={Profile} alt="profile" className={styles.icon} />
          <input
            onChange={(event) => handleInputChange(event, setLogin)}
            className={styles.input}
            placeholder="Логин"
            type="text"
          />
        </div>
        <div className={styles.input__block}>
          <img className={styles.icon} alt="profile" src={Lock} />
          <input
            onChange={(event) => handleInputChange(event, setPassword)}
            type={isVisiblePassword ? "text" : "password"}
            className={styles.input}
            placeholder="Пароль"
          />
          <img
            onClick={() => setIsVisiblePassword(!isVisiblePassword)}
            src={!isVisiblePassword ? ShowPassword : HidePassword}
            className={styles.password__icon}
            alt="showPassword"
          />
        </div>
        {isError && (
          <span className={styles.error__message}>
            Введены неверный логин или пароль.
          </span>
        )}
        <div className={styles.login__btn} onClick={handleLogin}>
          <span className={styles.login__text}>Войти</span>
          <img src={ArrowRight} className={styles.arrow__icon} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Login;
