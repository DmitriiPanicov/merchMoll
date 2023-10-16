import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import CustomerSingleReportSection from "./sections/customerSingleReportSection";
import AdminSingleReportSection from "./sections/adminSingleReportSection";
import CustomerReportsSection from "./sections/customerReportsSection";
import ExpiredReportsSection from "./sections/expiredReportsSection";
import TunderSignalsSection from "./sections/tunderSignalsSection";
import AdminReportsSection from "./sections/adminReportsSection";

function UserReportApp() {
  const { data } = useSelector((state: any) => state.user.user);

  return (
    <Routes>
      {!data.isCustomer ? (
        <>
          <Route path="/expired" element={<ExpiredReportsSection />} />
          <Route path="/:id" element={<AdminSingleReportSection />} />
          <Route path="/" element={<AdminReportsSection />} />
        </>
      ) : (
        <>
          <Route path="/:id" element={<CustomerSingleReportSection />} />
          <Route path="/" element={<CustomerReportsSection />} />
          <Route path="/expired" element={null} />
        </>
      )}
      <Route path="/:id/signals" element={<TunderSignalsSection />} />
    </Routes>
  );
}

export default UserReportApp;
