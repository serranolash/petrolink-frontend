// client/src/App.jsx - NO debe tener BrowserRouter ni Router
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ useNavigate está bien, no es un Router
import PTForm from './components/forms/PTForm';
import Dashboard from './components/dashboard/Dashboard';
import UserManagement from './components/admin/UserManagement';
import Subscription from './components/subscription/Subscription';
import { FileText, BarChart3, LogOut, User, Building2, Users, Crown } from 'lucide-react';

function App() {
  const navigate = useNavigate(); // ✅ Esto funciona dentro de un Router padre
  const [activeTab, setActiveTab] = useState('form');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleSuccess = (data) => {
    console.log('Permiso generado:', data);
    setTimeout(() => setActiveTab('dashboard'), 1000);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';
  const isSupervisor = user?.role === 'supervisor';
  const isTechnician = user?.role === 'technician';

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-green-600" />
              <span className="font-semibold text-gray-700">{user?.company_name}</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                {isAdmin ? 'Administrador' : isSupervisor ? 'Supervisor' : 'Técnico'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{user?.full_name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition ${
                activeTab === 'form' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'
              }`}
            >
              <FileText className="w-5 h-5" />
              {isTechnician ? 'Solicitar Permiso' : 'Nuevo Permiso'}
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition ${
                activeTab === 'dashboard' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Dashboard
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition ${
                  activeTab === 'users' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'
                }`}
              >
                <Users className="w-5 h-5" />
                Usuarios
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => setActiveTab('subscription')}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition ${
                  activeTab === 'subscription' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'
                }`}
              >
                <Crown className="w-5 h-5" />
                Suscripción
              </button>
            )}
          </div>
        </div>
      </div>

      {activeTab === 'form' && (
        <PTForm 
          onSubmitSuccess={handleSuccess} 
          token={token} 
          userRole={user?.role}
          currentUser={user}
        />
      )}
      {activeTab === 'dashboard' && <Dashboard token={token} userRole={user?.role} currentUser={user} />}
      {activeTab === 'users' && <UserManagement token={token} />}
      {activeTab === 'subscription' && <Subscription token={token} />}
    </div>
  );
}

export default App;