import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Eventos from './pages/Eventos';
import DetalhesEvento from './pages/DetalhesEvento';
import UploadImagem from './pages/UploadImagem';
import NovoEvento from './pages/NovoEvento';
import Navbar from './components/Navbar';
import EditarEvento from './pages/EditarEvento';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import AdminLotes from './pages/AdminLotes';
import DetalhesLote from './pages/DetalhesLote';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/eventos/:id" element={<DetalhesEvento />} />
        <Route path="/upload" element={<UploadImagem />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/lotes/:id" element={<DetalhesLote />} />
        
        {/* Rotas protegidas */}
        <Route path="/novo-evento" element={
          <PrivateRoute>
            <NovoEvento />
          </PrivateRoute>
        } />
        
        <Route path="/editar-evento/:id" element={
          <PrivateRoute>
            <EditarEvento />
          </PrivateRoute>
        } />

        <Route path="/admin-lotes" element={
          <PrivateRoute>
            <AdminLotes />
          </PrivateRoute>
        } />
      </Routes>
    </>
  );
}

export default App;
