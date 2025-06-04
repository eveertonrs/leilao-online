import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { usuario, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to="/" className="text-white text-lg font-semibold hover:text-blue-300 transition duration-300">
          Sistema de Leilões
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/" className="text-gray-200 hover:text-white transition duration-300">
            Home
          </Link>

          {/* ADMIN - pode ver Novo Evento e Admin Lotes */}
          {usuario && usuario.tipo === 'ADMIN' && (
            <>

            </>
          )}

          {usuario ? (
            <>
              <span className="text-gray-200">Olá, {usuario.nome}</span>
              <button onClick={logout} className="text-gray-200 hover:text-white transition duration-300">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-200 hover:text-blue-300 transition duration-300">
                Login
              </Link>
              <Link to="/admin/login" className="text-gray-200 hover:text-blue-300 transition duration-300">
                Admin Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
