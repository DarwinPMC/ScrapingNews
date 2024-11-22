import React, { useState, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa'; // Ícono de mensaje
import axios from 'axios';

const Comentarios = ({ userRole }) => {
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchComentarios = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/comentarios');
                setComentarios(response.data); // Backend ya envía los comentarios con nombreUsuario
            } catch (error) {
                console.error('Error al obtener los comentarios:', error);
            }
        };

        fetchComentarios();
    }, []);

    const handleAddComentario = async () => {
        if (userRole !== 5) {
            setError('Solo los usuarios con plan VIP pueden comentar.');
            return;
        }

        if (!nuevoComentario.trim()) {
            setError('El comentario no puede estar vacío.');
            return;
        }

        setError('');
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/comentarios',
                { texto: nuevoComentario },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // Obtén los comentarios actualizados desde el backend
            const updatedComments = await axios.get('http://localhost:5000/api/comentarios');
            setComentarios(updatedComments.data.slice(0, 5));

            setNuevoComentario(''); // Limpia el campo de texto
        } catch (error) {
            console.error('Error al agregar el comentario:', error);
        }
    };

    return (
        <div className="mt-8 p-6 bg-white shadow rounded max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-black">Comentarios</h2>
            {comentarios.length === 0 ? (
                <p className="text-gray-600">No hay comentarios aún. ¡Sé el primero en comentar!</p>
            ) : (
                <ul className="space-y-4">
                    {comentarios.map((comentario, index) => (
                        <li key={index} className="p-4 bg-gray-100 rounded shadow-sm">
                            <p className="font-semibold text-black">{comentario.nombreUsuario}</p>
                            <p className="text-gray-800">{comentario.texto}</p>
                            <p className="text-sm text-gray-500">
                                {new Date(comentario.fecha).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            )}

            <div className="mt-6 flex items-center space-x-4">
                {/* El textarea es visible, pero está deshabilitado para usuarios sin rol adecuado */}
                <textarea
                    className={`w-full p-3 border rounded shadow-sm focus:outline-none ${
                        userRole === 5 ? 'focus:ring-2 focus:ring-blue-500' : 'cursor-not-allowed bg-gray-200'
                    }`}
                    placeholder={
                        userRole === 5
                            ? 'Escribe tu comentario aquí...'
                            : 'Solo usuarios VIP pueden comentar.'
                    }
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                    disabled={userRole !== 5}
                    rows={2}
                />
                {/* Botón para enviar comentario: Solo habilitado si el usuario tiene el rol adecuado */}
                <button
                    onClick={handleAddComentario}
                    className={`p-3 rounded-full ${
                        userRole === 5
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    }`}
                    title={userRole === 5 ? 'Enviar comentario' : 'Acceso restringido'}
                >
                    <FaPaperPlane size={20} />
                </button>
            </div>
            {error && <p className="mt-2 text-red-600">{error}</p>}
        </div>
    );
};

export default Comentarios;
