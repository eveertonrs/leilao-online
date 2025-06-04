import React from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';
import AdminLotes from './pages/admin/AdminLotes';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import Home from './pages/Home';
import DetalhesLote from './pages/DetalhesLote';
import LoginPage from './pages/LoginPage';
//import NovoEvento from './pages/NovoEvento';
import NovoEvento from './pages/admin/NovoEvento'; // <-- certo!
import PrivateRoute from './components/PrivateRoute';
import UploadImagem from './pages/UploadImagem';
import AdminPanelLayout from './layouts/AdminPanelLayout';
import DetalhesEvento from './pages/DetalhesEvento';
import LoginAdmin from './pages/admin/LoginAdmin';
import Navbar from './components/Navbar';
import './index.css';
import AdminEventos from './pages/admin/AdminEventos';
import NovoLote from './pages/admin/NovoLote';
import EditarEvento from './pages/admin/EditarEvento';
import EditarLote from './pages/admin/EditarLote';


function App() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />

      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/eventos" element={<DetalhesEvento />} />
        <Route path="/eventos/:id" element={<DetalhesEvento />} />
        <Route path="/lotes/:id" element={<DetalhesLote />} />
        <Route path="/upload" element={<UploadImagem />} />

        {/* Login do Admin */}
        <Route path="/admin/login" element={<LoginAdmin />} />

        {/* Rotas protegidas e layout do painel admin */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <AdminPanelLayout children={undefined} />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="eventos" element={<AdminEventos />} />
          <Route path="novo-evento" element={<NovoEvento />} />
          <Route path="editar-evento/:id" element={<EditarEvento />} />
          <Route path="lotes" element={<AdminLotes />} />
          <Route path="novo-lote" element={<NovoLote />} />
          <Route path="editar-lote/:id" element={<EditarLote />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
