import { FC } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import CustomersList from "../../../pages/accessRights/customersList/customersList";
import CircleLoader from "../../../components/custom/circleLoader/circleLoader";
import SectionContent from "../../../components/sectionContent/sectionContent";
import Sidebar from "../../../components/sidebar/Sidebar";

import "../../../scss/App.scss";

const AdminRolesSection: FC = () => {
  const { customersCount } = useSelector(
    (state: any) => state.roles.customerList
  );

  return (
    <div className="App">
      <Sidebar />
      <SectionContent
        section="Права доступа"
        pageName="accessRights"
        title="Клиенты"
      >
        <div className="content__main">
          <div className="btns">
            <Link to="/accessRights/roles" className="tab">
              <div className="buttons__btn">Роли</div>
            </Link>
            <Link to="/accessRights/customers" className="tab">
              <div className="buttons__btn --active">
                Клиенты
                <div className="tab__reports_count">
                  {!customersCount && customersCount !== 0 ? (
                    <CircleLoader />
                  ) : (
                    customersCount
                  )}
                </div>
              </div>
            </Link>
          </div>
          <CustomersList />
        </div>
      </SectionContent>
    </div>
  );
};

export default AdminRolesSection;
