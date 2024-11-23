import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editData, setEditData] = useState({ id: null, nombre: '', email: '' });
    const [editRole, setEditRole] = useState({ id: null, id_rol: '' });
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);

    useEffect(() => {
        const fetchUsuarios = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/usuarios');
                setUsuarios(response.data);
            } catch (error) {
                console.error('Error al obtener los usuarios:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsuarios();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            try {
                await axios.delete(`http://localhost:5000/api/usuarios/${id}`);
                setUsuarios(usuarios.filter(usuario => usuario.id !== id));
                alert('Usuario eliminado correctamente.');
            } catch (error) {
                console.error('Error al eliminar el usuario:', error);
                alert('Hubo un error al eliminar el usuario.');
            }
        }
    };

    const handleEdit = (id) => {
        const userToEdit = usuarios.find(usuario => usuario.id === id);
        setEditData({ id: userToEdit.id, nombre: userToEdit.nombre, email: userToEdit.email });
        setShowEditModal(true);
    };

    const handleEditSubmit = async () => {
        try {
            await axios.put(`http://localhost:5000/api/usuarios/${editData.id}`, {
                nombre: editData.nombre,
                email: editData.email
            });
            alert('Usuario actualizado correctamente.');
            setEditData({ id: null, nombre: '', email: '' });
            setShowEditModal(false);
            // Refresca la lista de usuarios
            const response = await axios.get('http://localhost:5000/api/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            alert('Hubo un error al actualizar el usuario.');
        }
    };

    const handleEditRole = (id) => {
        const userToEdit = usuarios.find(usuario => usuario.id === id);
        setEditRole({ id: userToEdit.id, id_rol: userToEdit.id_rol });
        setShowRoleModal(true);
    };

    const handleEditRoleSubmit = async () => {
        try {
            await axios.put(`http://localhost:5000/api/usuarios/${editRole.id}/rol`, {
                id_rol: editRole.id_rol
            });
            alert('Rol del usuario actualizado correctamente.');
            setEditRole({ id: null, id_rol: '' });
            setShowRoleModal(false);
            // Refresca la lista de usuarios
            const response = await axios.get('http://localhost:5000/api/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error al actualizar el rol del usuario:', error);
            alert('Hubo un error al actualizar el rol del usuario.');
        }
    };

    return (
        <div className="container mx-auto p-4 mt-20">
            <h1 className="text-3xl font-bold mb-4">Usuarios Registrados</h1>
            {isLoading ? (
                <p className="text-center text-gray-600">Cargando usuarios...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b">ID</th>
                                <th className="px-4 py-2 border-b">Nombre</th>
                                <th className="px-4 py-2 border-b">Email</th>
                                <th className="px-4 py-2 border-b">Rol</th>
                                <th className="px-4 py-2 border-b">Operaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario, index) => (
                                <tr key={index} className="text-center">
                                    <td className="px-4 py-2 border-b">{usuario.id}</td>
                                    <td className="px-4 py-2 border-b">{usuario.nombre}</td>
                                    <td className="px-4 py-2 border-b">{usuario.email}</td>
                                    <td className="px-4 py-2 border-b">{usuario.id_rol}</td>
                                    <td className="px-4 py-2 border-b">
                                        <button
                                            onClick={() => handleEdit(usuario.id)}
                                            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleEditRole(usuario.id)}
                                            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                                        >
                                            Editar Rol
                                        </button>
                                        <button
                                            onClick={() => handleDelete(usuario.id)}
                                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {/* Modal para editar usuario */}
            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-lg w-1/3">
                        <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={editData.nombre}
                            onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
                            className="p-2 border border-gray-300 rounded w-full mb-2"
                        />
                        <input
                            type="email"
                            placeholder="Correo"
                            value={editData.email}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                            className="p-2 border border-gray-300 rounded w-full mb-4"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 mr-2"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleEditSubmit}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal para editar el rol */}
            {showRoleModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-lg w-1/3">
                        <h2 className="text-xl font-bold mb-4">Editar Rol del Usuario</h2>
                        <select
                            value={editRole.id_rol}
                            onChange={(e) => setEditRole({ ...editRole, id_rol: e.target.value })}
                            className="p-2 border border-gray-300 rounded w-full mb-4"
                        >
                            <option value="" disabled>Seleccionar Rol</option>
                            <option value="1">Rol 1</option>
                            <option value="2">Rol 2</option>
                            <option value="3">Rol 3</option>
                            <option value="4">Rol 4</option>
                            <option value="5">Rol 5</option>
                        </select>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowRoleModal(false)}
                                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 mr-2"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleEditRoleSubmit}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Usuarios;
