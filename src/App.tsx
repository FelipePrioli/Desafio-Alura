import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import DriverRegistration from '@/pages/DriverRegistration';
import Drivers from '@/pages/Drivers';
import UserRegistration from '@/pages/UserRegistration';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import EvaluationItems from '@/pages/EvaluationItems';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/driver-registration" element={<DriverRegistration />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/evaluation-items" element={<EvaluationItems />} />
        <Route path="/user-registration" element={<UserRegistration />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;