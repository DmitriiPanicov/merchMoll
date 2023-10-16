import { FC } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import clsx from "clsx";

import { reducerSidebar } from "../../../redux/reducer/user/reducers/reducerUser";
import { AppDispatch } from "../../../redux/reducer/store";

import SidebarLink from "../../custom/sidebarLink/sidebarLink";

import { ReactComponent as VisitGraphIcon } from "../../../assets/icons/visit-graph-icon.svg";
import { ReactComponent as ReportsIcon } from "../../../assets/icons/reports-icon.svg";
import { ReactComponent as UnloadingsIcon } from "../../../assets/icons/unloading.svg";
import { ReactComponent as ChevronIcon } from "../../../assets/icons/chevron.svg";

interface IProps {
  isOpenUnloadings: any;
  isOpenSidebar: any;
  data: any;
}

const additionalLinks = [
  { to: "/unloadings/excel", text: "Excel" },
  { to: "/unloadings/zip", text: "Zip" },
];

const CustomerSidebarSection: FC<IProps> = ({
  isOpenUnloadings,
  isOpenSidebar,
  data,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const pathname = window.location.pathname;

  const handleOpenUnloadings = (event: any) => {
    event.preventDefault();

    localStorage.setItem("isOpenUnloadings", JSON.stringify(!isOpenUnloadings));

    dispatch(
      reducerSidebar({
        isOpenSidebar: isOpenSidebar,
        isOpenUnloadings: !isOpenUnloadings,
      })
    );
  };

  return (
    <div className="menu__item">
      <div className="buttons">
        <SidebarLink
          icon={<ReportsIcon className="active__sidebar_icon" />}
          content="Отчеты"
          to="/reports"
        />
        <SidebarLink
          chevron={
            <ChevronIcon
              className={clsx(
                "chevron__icon",
                isOpenUnloadings && "active__chevron_icon",
                "active__sidebar_icon"
              )}
              onClick={handleOpenUnloadings}
            />
          }
          icon={<UnloadingsIcon className="active__sidebar_icon" />}
          to="/unloadings/excel"
          content="Выгрузки"
        />
        <div
          className={clsx(
            "additional__links_block",
            isOpenUnloadings && "active__additional_links"
          )}
        >
          {additionalLinks.map((link) => (
            <span
              className={clsx(
                "additional__link",
                isOpenUnloadings && "active__additional_link"
              )}
              key={link.to}
            >
              <Link
                className={clsx(
                  "link",
                  pathname.includes(link.to) && "underline"
                )}
                to={link.to}
              >
                {link.text}
              </Link>
            </span>
          ))}
        </div>
        {data?.settings?.visitSchedule && (
          <SidebarLink
            icon={<VisitGraphIcon className="active__sidebar_icon" />}
            to="/visit-schedule"
            content="График"
          />
        )}
      </div>
    </div>
  );
};

export default CustomerSidebarSection;
