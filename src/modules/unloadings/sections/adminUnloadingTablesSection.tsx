import { FC } from "react";
import { Link } from "react-router-dom";

import UnloadingTables from "../../../pages/unloadings/unloadingTables/unloadingTables";
import SectionContent from "../../../components/sectionContent/sectionContent";
import Sidebar from "../../../components/sidebar/Sidebar";

import "../../../scss/App.scss";

const AdminUnloadingTablesSection: FC = () => {
  return (
    <div className="App">
      <Sidebar />
      <SectionContent section="Заказанные табели" pageName="unloadings">
        <div className="content__main">
          <div className="btns">
            <Link to="/unloadings/excel" className="tab">
              <div className="buttons__btn">Excel</div>
            </Link>
            <Link to="/unloadings/zip" className="tab">
              <div className="buttons__btn">Zip</div>
            </Link>
            <Link to="/unloadings/tables" className="tab">
              <div className="buttons__btn  --active">Табели</div>
            </Link>
            <Link to="/unloadings/cron" className="tab">
              <div className="buttons__btn">Cron</div>
            </Link>
          </div>
          <UnloadingTables />
        </div>
      </SectionContent>
    </div>
  );
};

export default AdminUnloadingTablesSection;
