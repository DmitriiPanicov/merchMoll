import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import CustomerSettings from "../../../pages/accessRights/customerSettings/customerSettings";
import SectionContent from "../../../components/sectionContent/sectionContent";
import Sidebar from "../../../components/sidebar/Sidebar";

import "../../../scss/App.scss";

const AdminClientsInfoSection = () => {
  const { id } = useParams<{ id: string }>();
  const { customers } = useSelector((state: any) => state.roles.customerList);

  const actualClientName =
    customers &&
    customers.find(
      (elem: any) => elem?.customer?.id === parseFloat(id as string)
    )?.customer?.name;

  return (
    <div className="App">
      <Sidebar />
      <SectionContent
        title={actualClientName && actualClientName}
        pageName="clientSettings"
        section="Клиенты"
        tail="Настройки"
      >
        <div className="content__main">
          <div className="btns">
            <Link to={`/accessRights/customers/info/${id}`} className="tab">
              <div className="buttons__btn">Контракты</div>
            </Link>
            <Link to={`/accessRights/customers/settings/${id}`} className="tab">
              <div className="buttons__btn --active">Настройки</div>
            </Link>
            <Link to={`/accessRights/customers/regions/${id}`} className="tab">
              <div className="buttons__btn">Регионы</div>
            </Link>
          </div>
          <CustomerSettings />
        </div>
      </SectionContent>
    </div>
  );
};

export default AdminClientsInfoSection;
