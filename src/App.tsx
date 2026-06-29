import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/cp/ProtectedRoute";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Registrar from "./pages/Registrar";
import Consultar from "./pages/Consultar";
import Historico from "./pages/Historico";
import NovoMercado from "./pages/NovoMercado";
import Conta from "./pages/Conta";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/registrar" element={<ProtectedRoute><Registrar /></ProtectedRoute>} />
        <Route path="/consultar" element={<ProtectedRoute><Consultar /></ProtectedRoute>} />
        <Route path="/historico" element={<ProtectedRoute><Historico /></ProtectedRoute>} />
        <Route path="/novo-mercado" element={<ProtectedRoute><NovoMercado /></ProtectedRoute>} />
        <Route path="/conta" element={<ProtectedRoute><Conta /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
