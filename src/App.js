import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppProviders from "./components/AppProviders";
import HomeRedirectPage from "./pages/HomeRedirectPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AlertsPage from "./pages/AlertsPage";
import DocumentsPage from "./pages/DocumentsPage";
import DocumentDetailPage from "./pages/DocumentDetailPage";
import FinancePage from "./pages/FinancePage";
import FinanceDetailPage from "./pages/FinanceDetailPage";
import OperationsPage from "./pages/OperationsPage";
import RoomDetailPage from "./pages/RoomDetailPage";
import ShiftDetailPage from "./pages/ShiftDetailPage";
import PatientsPage from "./pages/PatientsPage";
import PatientDetailPage from "./pages/PatientDetailPage";
import ReportsPage from "./pages/ReportsPage";
import SecurityPage from "./pages/SecurityPage";
import StaffPage from "./pages/StaffPage";
import TeamPage from "./pages/TeamPage";
import UsersPage from "./pages/UsersPage";
import AIAssistantPage from "./pages/AIAssistantPage";
import MyTreatmentsPage from "./pages/MyTreatmentsPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRedirectPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/alerts" element={<AlertsPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/documents/:id" element={<DocumentDetailPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/finance/:id" element={<FinanceDetailPage />} />
          <Route path="/operations" element={<OperationsPage />} />
          <Route path="/my-treatments" element={<MyTreatmentsPage />} />
          <Route path="/operations/rooms/:id" element={<RoomDetailPage />} />
          <Route path="/operations/shifts/:id" element={<ShiftDetailPage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/patients/:id" element={<PatientDetailPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          {/* <Route path="/security" element={<SecurityPage />} /> */}
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
