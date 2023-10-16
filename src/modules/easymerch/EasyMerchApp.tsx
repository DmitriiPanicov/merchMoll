import { Routes, Route } from "react-router-dom";

import IntegrationErrors from "./sections/IntegrationErrors";
import ServiceTypes from "./sections/ServiceTypes";
import Outlets from "./sections/Outlets";
import Report from "./sections/Report";
import Users from "./sections/Users";

function EasyMerchApp() {
  const data = JSON.parse(localStorage.getItem("userData") as string);

  return (
    <Routes>
      {!data.isCustomer && (
        <>
          <Route path="/integration-errors" element={<IntegrationErrors />} />
          <Route path="/service-types" element={<ServiceTypes />} />
          <Route path="/outlets" element={<Outlets />} />
          <Route path="/report" element={<Report />} />
          <Route path="/users" element={<Users />} />
        </>
      )}
    </Routes>
  );
}

export default EasyMerchApp;
