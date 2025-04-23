import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Eventos from './pages/Eventos';
import DetalhesEvento from './pages/DetalhesEvento';
import UploadImagem from './pages/UploadImagem'; 
import NovoEvento from './pages/NovoEvento';
import Navbar from './components/Navbar'; 
import EditarEvento from './pages/EditarEvento';

function App() {
  return (
    <>
      <Navbar /> {/* ⬅️ Adiciona menu fixo */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/eventos/:id" element={<DetalhesEvento />} />
        <Route path="/upload" element={<UploadImagem />} />
        <Route path="/novo-evento" element={<NovoEvento />} />
        <Route path="/editar-evento/:id" element={<EditarEvento />} />
      </Routes>
    </>
  );
}

export default App;
