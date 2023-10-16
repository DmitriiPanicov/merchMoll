import { FC } from "react";
import { Link } from "react-router-dom";

import UnloadingCron from "../../../pages/unloadings/unloadingCron/unloadingCron";
import SectionContent from "../../../components/sectionContent/sectionContent";
import Sidebar from "../../../components/sidebar/Sidebar";

import "../../../scss/App.scss";

const AdminUnloadingCronSection: FC = () => {
  return (
    <div className="App">
      <Sidebar />
      <SectionContent section="Cron" pageName="unloadings">
        <div className="content__main">
          <div className="btns">
            <Link to="/unloadings/excel" className="tab">
              <div className="buttons__btn">Excel</div>
            </Link>
            <Link to="/unloadings/zip" className="tab">
              <div className="buttons__btn">Zip</div>
            </Link>
            <Link to="/unloadings/tables" className="tab">
              <div className="buttons__btn">Табели</div>
            </Link>
            <Link to="/unloadings/cron" className="tab">
              <div className="buttons__btn --active">Cron</div>
            </Link>
          </div>
          <UnloadingCron />
        </div>
      </SectionContent>
    </div>
  );
};

export default AdminUnloadingCronSection;
