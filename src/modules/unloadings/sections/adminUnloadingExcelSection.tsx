import { FC } from "react";
import { Link } from "react-router-dom";

import UnloadingExcel from "../../../pages/unloadings/unloadingExcel/unloadingExcel";
import SectionContent from "../../../components/sectionContent/sectionContent";
import Sidebar from "../../../components/sidebar/Sidebar";

import "../../../scss/App.scss";

const AdminUnloadingExcelSection: FC = () => {
  return (
    <div className="App">
      <Sidebar />
      <SectionContent section="Заказанные документы" pageName="unloadings">
        <div className="content__main">
          <div className="btns">
            <Link to="/unloadings/excel" className="tab">
              <div className="buttons__btn --active">Excel</div>
            </Link>
            <Link to="/unloadings/zip" className="tab">
              <div className="buttons__btn">Zip</div>
            </Link>
            <Link to="/unloadings/tables" className="tab">
              <div className="buttons__btn">Табели</div>
            </Link>
            <Link to="/unloadings/cron" className="tab">
              <div className="buttons__btn">Cron</div>
            </Link>
          </div>
          <UnloadingExcel />
        </div>
      </SectionContent>
    </div>
  );
};

export default AdminUnloadingExcelSection;
