import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Edit2, Trash2, CheckCircle, XCircle, Shield, UserCheck, User } from 'lucide-react';

const UserManagement = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'technician'
  });

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        setShowModal(false);
        setFormData({ email: '', password: '', full_name: '', role: 'technician' });
        alert('Usuario creado exitosamente');
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Error al crear usuario');
    }
  };

  const handleToggleActive = async (user) => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_active: !user.is_active })
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
      }
    } catch (error) {
      alert('Error al actualizar usuario');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Error al eliminar usuario');
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return <Shield className="w-4 h-4 text-purple-600" />;
      case 'supervisor': return <UserCheck className="w-4 h-4 text-blue-600" />;
      default: return <User className="w-4 h-4 text-green-600" />;
    }
  };

  const getRoleName = (role) => {
    switch(role) {
      case 'admin': return 'Administrador';
      case 'supervisor': return 'Supervisor';
      default: return 'Técnico';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando usuarios...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-800">Gestión de Usuarios</h2>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setFormData({ email: '', password: '', full_name: '', role: 'technician' });
            setShowModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <UserPlus className="w-4 h-4" />
          Nuevo Usuario
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Rol</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{user.full_name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1">
                    {getRoleIcon(user.role)}
                    {getRoleName(user.role)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleActive(user)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {user.is_active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {user.is_active ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre completo"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-2 border rounded-lg"
              >
                <option value="technician">Técnico de Campo</option>
                <option value="supervisor">Supervisor</option>
              </select>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                >
                  Crear Usuario
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 py-2 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;