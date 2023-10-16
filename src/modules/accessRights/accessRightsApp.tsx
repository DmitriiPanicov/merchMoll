import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import AdminClientsSettingsSection from "./sections/adminClientsSettingsSection";
import AdminClientsRegionsSection from "./sections/adminClientsRegionsSection";
import AdminClientsInfoSection from "./sections/adminClientsInfoSection";
import AdminClientsSection from "./sections/adminClientsSection";
import AdminRolesSection from "./sections/adminRolesSection";

function AccessRightsApp() {
  const { data } = useSelector((state: any) => state.user.user);

  return (
    <Routes>
      {!data.isCustomer && (
        <>
          <Route path="/roles" element={<AdminRolesSection />} />
          <Route path="/customers" element={<AdminClientsSection />} />
          <Route
            element={<AdminClientsInfoSection />}
            path="/customers/info/:id"
          />
          <Route
            element={<AdminClientsSettingsSection />}
            path="/customers/settings/:id"
          />
          <Route
            element={<AdminClientsRegionsSection />}
            path="/customers/regions/:id"
          />
        </>
      )}
    </Routes>
  );
}

export default AccessRightsApp;
