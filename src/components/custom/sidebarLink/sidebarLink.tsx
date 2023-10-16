import { FC } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import clsx from "clsx";

interface IProps {
  content?: string;
  chevron?: any;
  to?: string;
  icon?: any;
}

const SidebarLink: FC<IProps> = ({ to, icon, chevron, content }) => {
  const { isOpenSidebar } = useSelector((state: any) => state.user.user);

  const pathname = window.location.pathname;

  return (
    <Link
      className={clsx(
        "sidebar__btn",
        pathname.includes((to as string)?.split("/")[1]) && "--active"
      )}
      to={to as string}
    >
      {icon}
      {isOpenSidebar ? (
        <>
          <span className="link">{content}</span>
          {chevron}
        </>
      ) : (
        <div className="tooltip">
          <span className="tooltip__content">{content}</span>
        </div>
      )}
    </Link>
  );
};

export default SidebarLink;
