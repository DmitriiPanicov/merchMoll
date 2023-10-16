import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import store from "./redux/reducer/store";

import VisitScheduleApp from "./modules/visitSchedule/visitScheduleApp";
import AccessRightsApp from "./modules/accessRights/accessRightsApp";
import UserReportsApp from "./modules/userReports/UserReportsApp";
import PrivateRoute from "./components/privateRoute/privateRoute";
import UnloadingsApp from "./modules/unloadings/unloadingsApp";
import EasyMerchApp from "./modules/easymerch/EasyMerchApp";
import TunderApp from "./modules/tunder/TunderApp";
import Login from "./pages/login/login";

import "./scss/index.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const detectedBasename = window.location.pathname.startsWith("/react")
  ? "/react"
  : "/";

root.render(
  <Provider store={store}>
    <BrowserRouter basename={detectedBasename}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/easymerch/*"
          // element={<PrivateRoute component={<EasyMerchApp />} />}
          element={<PrivateRoute component={<EasyMerchApp />} />}
        />
        <Route
          path="/tunder/*"
          element={<PrivateRoute component={<TunderApp />} />}
        />
        <Route
          path="/reports/*"
          element={<PrivateRoute component={<UserReportsApp />} />}
        />
        <Route
          path="/accessRights/*"
          element={<PrivateRoute component={<AccessRightsApp />} />}
        />
        <Route
          path="/visit-schedule/*"
          element={<PrivateRoute component={<VisitScheduleApp />} />}
        />
        <Route
          path="/unloadings/*"
          element={<PrivateRoute component={<UnloadingsApp />} />}
        />
        <Route path="/login/*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);
