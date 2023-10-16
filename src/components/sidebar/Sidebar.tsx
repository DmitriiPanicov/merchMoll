import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import clsx from "clsx";

import { reducerSidebar } from "../../redux/reducer/user/reducers/reducerUser";
import { AppDispatch } from "../../redux/reducer/store";

import CustomerSidebarSection from "./sections/customerSidebarSection";
import AdminSidebarSection from "./sections/adminSidebarSection";

// import { ReactComponent as SettingsIcon } from "../../assets/icons/settings.svg";
import { ReactComponent as ChevronIcon } from "../../assets/icons/chevron.svg";
import { ReactComponent as ExcludeIcon } from "../../assets/icons/exclude.svg";
import { ReactComponent as AvatarIcon } from "../../assets/icons/avatar.svg";
import { ReactComponent as ExitIcon } from "../../assets/icons/exit.svg";

import "./sidebar.scss";

const IS_VISIBLE_SIDEBAR = process.env.REACT_APP_IS_VISIBLE_SIDEBAR;

const Sidebar: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { data, isOpenSidebar, isOpenUnloadings } = useSelector(
    (state: any) => state.user.user
  );

  const userData = JSON.parse(localStorage.getItem("userData") as string);

  const handleClickExitBtn = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleOpenSidebar = () => {
    localStorage.setItem("isOpenSidebar", JSON.stringify(!isOpenSidebar));
    localStorage.setItem("isOpenUnloadings", JSON.stringify(false));

    dispatch(
      reducerSidebar({
        isOpenSidebar: !isOpenSidebar,
        isOpenUnloadings: false,
      })
    );
  };

  return (
    <>
      {JSON.parse(IS_VISIBLE_SIDEBAR as string) && (
        <div className={clsx("leftMenu", !isOpenSidebar && "closed__leftMenu")}>
          <div
            className={clsx(
              "logo__block",
              !isOpenSidebar && "closed__logo_block"
            )}
          >
            <Link
              to="/reports"
              className={clsx("logo", !isOpenSidebar && "closed__logo")}
            >
              <div className="logo__img">
                <ExcludeIcon className="active__sidebar_icon" />
              </div>
              <div className="logo__text">Merch Online</div>
            </Link>
            <ChevronIcon
              onClick={handleOpenSidebar}
              className={clsx(
                "sidebar__chevron",
                isOpenSidebar && "active__sidebar_chevron"
              )}
            />
          </div>
          <div className={clsx("menu", !isOpenSidebar && "closed__menu")}>
            {!userData.isCustomer ? (
              <AdminSidebarSection
                isOpenUnloadings={isOpenUnloadings}
                isOpenSidebar={isOpenSidebar}
              />
            ) : (
              <CustomerSidebarSection
                isOpenUnloadings={isOpenUnloadings}
                isOpenSidebar={isOpenSidebar}
                data={data}
              />
            )}
          </div>
          {isOpenSidebar ? (
            <>
              <div className="menu__bottom">
                <div className="menu__bottom_avatar">
                  <AvatarIcon className="active__sidebar_icon" />
                </div>
                <div className="menu__bottom_text">
                  <span>{userData.login}</span>
                  <span>
                    {userData.isCustomer ? "Клиент" : "Администратор"}
                  </span>
                </div>
                {/* <SettingsIcon className="active__sidebar_icon" /> */}
              </div>
              <div className="exit__block">
                <span className="exit__btn" onClick={handleClickExitBtn}>
                  Выход
                </span>
              </div>
            </>
          ) : (
            <div className="menu__bottom_buttons">
              {/* <div className="menu__bottom_btn">
                <SettingsIcon className="active__sidebar_icon" />
                <span className="tooltip">Настройки</span>
              </div> */}

              <div className="menu__bottom_btn" onClick={handleClickExitBtn}>
                <ExitIcon className="exit__icon" />
                <div className="tooltip">
                  <span className="tooltip__content">Выход</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Sidebar;
