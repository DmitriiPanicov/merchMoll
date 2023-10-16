import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import CustomerInfo from "../../../pages/accessRights/customerInfo/customerInfo";
import CircleLoader from "../../../components/custom/circleLoader/circleLoader";
import SectionContent from "../../../components/sectionContent/sectionContent";
import Sidebar from "../../../components/sidebar/Sidebar";

import "../../../scss/App.scss";

const AdminClientsInfoSection = () => {
  const { id } = useParams<{ id: string }>();
  const { clientContractsLength, customers } = useSelector(
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
        pageName="clientInfo"
        section="Клиенты"
      >
        <div className="content__main">
          <div className="btns">
            <Link to={`/accessRights/customers/info/${id}`} className="tab">
              <div className="buttons__btn --active">
                Контракты
                <div className="tab__reports_count">
                  {!clientContractsLength && clientContractsLength !== 0 ? (
                    <CircleLoader />
                  ) : (
                    clientContractsLength
                  )}
                </div>
              </div>
            </Link>
            <Link to={`/accessRights/customers/settings/${id}`} className="tab">
              <div className="buttons__btn">Настройки</div>
            </Link>
            <Link to={`/accessRights/customers/regions/${id}`} className="tab">
              <div className="buttons__btn">Регионы</div>
            </Link>
          </div>
          <CustomerInfo />
        </div>
      </SectionContent>
    </div>
  );
};

export default AdminClientsInfoSection;
