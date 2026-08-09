import { BrowserRouter, Routes, Route ,Navigate} from "react-router-dom"
import GettingStarted from "./pages/GettingStarted";
import Login from "./authorisation/Login"
import Dashboard from "./pages/Dashboard"
import Trades from "./pages/Trades"
import Signup from "./authorisation/Signup"
import Analytics from "./pages/Analytics"
import Calendar from "./pages/Calendar"
import AccountSettings from "./pages/AccountSettings"
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GettingStarted />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>} />
        <Route path="/trades" element={<ProtectedRoute><Trades /> </ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
        <Route path="/accountsettings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
