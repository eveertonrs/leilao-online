import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Eventos from './pages/Eventos';
import DetalhesEvento from './pages/DetalhesEvento';
import UploadImagem from './pages/UploadImagem'; 
import NovoEvento from './pages/NovoEvento';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/eventos" element={<Eventos />} />
      <Route path="/eventos/:id" element={<DetalhesEvento />} />
      <Route path="/upload" element={<UploadImagem />} />
      <Route path="/novo-evento" element={<NovoEvento />} />
    </Routes>
  );
}

export default App;
