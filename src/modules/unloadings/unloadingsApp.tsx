import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";

import AdminUnloadingTablesSection from "./sections/adminUnloadingTablesSection";
import AdminUnloadingExcelSection from "./sections/adminUnloadingExcelSection";
import AdminUnloadingCronSection from "./sections/adminUnloadingCronSection";
import AdminUnloadingZipSection from "./sections/adminUnloadingZipSection";
import UnloadingExcelSection from "./sections/unloadingExcelSection";
import UnloadingZipSection from "./sections/unloadingZipSections";

function UnloadingsApp() {
  const { data } = useSelector((state: any) => state.user.user);

  return (
    <Routes>
      {!data.isCustomer ? (
        <>
          <Route path="/tables" element={<AdminUnloadingTablesSection />} />
          <Route path="/excel" element={<AdminUnloadingExcelSection />} />
          <Route path="/cron" element={<AdminUnloadingCronSection />} />
          <Route path="/zip" element={<AdminUnloadingZipSection />} />
        </>
      ) : (
        <>
          <Route path="/excel" element={<UnloadingExcelSection />} />
          <Route path="/zip" element={<UnloadingZipSection />} />
        </>
      )}
    </Routes>
  );
}

export default UnloadingsApp;
