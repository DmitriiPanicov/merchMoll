import { FC } from "react";
import { Link } from "react-router-dom";

import SectionContent from "../../../components/sectionContent/sectionContent";
import AdminRoles from "../../../pages/accessRights/roles/adminRoles";
import Sidebar from "../../../components/sidebar/Sidebar";

import "../../../scss/App.scss";

const AdminRolesSection: FC = () => {
  return (
    <div className="App">
      <Sidebar />
      <SectionContent
        section="Права доступа"
        pageName="accessRights"
        title="Роли"
      >
        <div className="content__main">
          <div className="btns">
            <Link to="/accessRights/roles" className="tab">
              <div className="buttons__btn --active">Роли</div>
            </Link>
            <Link to="/accessRights/customers" className="tab">
              <div className="buttons__btn">Клиенты</div>
            </Link>
          </div>
          <AdminRoles />
        </div>
      </SectionContent>
    </div>
  );
};

export default AdminRolesSection;
