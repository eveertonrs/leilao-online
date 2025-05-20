import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import LoginAdmin from './pages/admin/LoginAdmin';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import Eventos from './pages/Eventos';
import NovoEvento from './pages/NovoEvento';
import EditarEvento from './pages/EditarEvento';
import AdminLotes from './pages/AdminLotes';
import DetalhesEvento from './pages/DetalhesEvento';
import DetalhesLote from './pages/DetalhesLote';
import TesteMaterialUI from './pages/TesteMaterialUI';
import UploadImagem from './pages/UploadImagem';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './layouts/AdminLayout';

const App = () => {
  return (
    <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/eventos/:id" element={<DetalhesEvento />} />
        <Route path="/lotes/:id" element={<DetalhesLote />} />
        <Route path="/teste-material-ui" element={<TesteMaterialUI />} />
        <Route path="/upload-imagem" element={<UploadImagem />} />

        {/* Admin Authentication */}
        <Route path="/admin/login" element={<LoginAdmin />} />

        {/* Admin Area */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="eventos" element={<Eventos />} />
          <Route path="novo-evento" element={<NovoEvento />} />
          <Route path="editar-evento/:id" element={<EditarEvento />} />
          <Route path="lotes" element={<AdminLotes />} />
          <Route path="novo-lote" element={<AdminLotes />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
};

export default App;
