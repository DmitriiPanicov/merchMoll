import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import CustomerRegions from "../../../pages/accessRights/customerRegions/customerRegions";
import CircleLoader from "../../../components/custom/circleLoader/circleLoader";
import SectionContent from "../../../components/sectionContent/sectionContent";
import Sidebar from "../../../components/sidebar/Sidebar";

import "../../../scss/App.scss";

const AdminClientsInfoSection = () => {
  const { id } = useParams<{ id: string }>();
  const { clientRegionsLength, customers } = useSelector(
    (state: any) => state.roles.customerList
  );

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
        tail="Регионы"
      >
        <div className="content__main">
          <div className="btns">
            <Link to={`/accessRights/customers/info/${id}`} className="tab">
              <div className="buttons__btn">Контракты</div>
            </Link>
            <Link to={`/accessRights/customers/settings/${id}`} className="tab">
              <div className="buttons__btn">Настройки</div>
            </Link>
            <Link to={`/accessRights/customers/regions/${id}`} className="tab">
              <div className="buttons__btn --active">
                Регионы
                <div className="tab__reports_count">
                  {!clientRegionsLength && clientRegionsLength !== 0 ? (
                    <CircleLoader />
                  ) : (
                    clientRegionsLength
                  )}
                </div>
              </div>
            </Link>
          </div>
          <CustomerRegions />
        </div>
      </SectionContent>
    </div>
  );
};

export default AdminClientsInfoSection;
