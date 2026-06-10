import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Registrar from "./pages/Registrar";
import Consultar from "./pages/Consultar";
import Historico from "./pages/Historico";
import NovoMercado from "./pages/NovoMercado";
import Conta from "./pages/Conta";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/registrar" element={<Registrar />} />
      <Route path="/consultar" element={<Consultar />} />
      <Route path="/historico" element={<Historico />} />
      <Route path="/novo-mercado" element={<NovoMercado />} />
      <Route path="/conta" element={<Conta />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
