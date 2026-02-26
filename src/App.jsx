import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BLOProvider } from "./admin/BLOContext";

import AdminDashboard from "./admin/AdminDashboard";
import CreateBLO from "./admin/CreateBLO";
import AssignRegion from "./admin/AssignRegion";
import ViewReports from "./admin/ViewReports";

// Imported new components
import SimpleLogin from "./components/SimpleLogin";
import FormDashboard from "./pages/Dashboard";
import BdaHome from "./pages/BdaHome";

function App() {
  return (
    <BLOProvider>
      <BrowserRouter>
        <Routes>
          {/* Default Route: Login */}
          <Route path="/" element={<SimpleLogin />} />
          {/* keep `/login` as alias for backwards compatibility */}
          <Route path="/login" element={<Navigate to="/" replace />} />

          {/* BDA landing page (if a special ID should go here) */}
          <Route path="/bda" element={<BdaHome />} />

          {/* Form / Survey Route */}
          <Route path="/survey" element={<FormDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/create-blo" element={<CreateBLO />} />
          <Route path="/admin/assign-region" element={<AssignRegion />} />
          <Route path="/admin/reports" element={<ViewReports />} />
        </Routes>
      </BrowserRouter>
    </BLOProvider>
  );
}

export default App;