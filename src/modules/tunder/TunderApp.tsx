import { Routes, Route } from "react-router-dom";

import RetailOutlets from "./sections/RetailOutlets";
import Settings from "./sections/Settings";
import Signals from "./sections/Signals";

function TunderApp() {
  const data = JSON.parse(localStorage.getItem("userData") as string);

  return (
    <Routes>
      {!data.isCustomer && (
        <>
          <Route path="/retail-outlets" element={<RetailOutlets />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/signals" element={<Signals />} />
        </>
      )}
    </Routes>
  );
}

export default TunderApp;
