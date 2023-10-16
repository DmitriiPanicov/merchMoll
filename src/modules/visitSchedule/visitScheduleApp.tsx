import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";

import VisitScheduleSection from "./sections/visitScheduleSection";

function VisitScheduleApp() {
  const { data } = useSelector((state: any) => state.user.user);

  return (
    <Routes>
      {data.isCustomer && data.settings.visitSchedule && (
        <Route path="/" element={<VisitScheduleSection />} />
      )}
    </Routes>
  );
}

export default VisitScheduleApp;
