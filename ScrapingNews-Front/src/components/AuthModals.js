import React from 'react';
import axios from 'axios'; // Asegúrate de tener axios importado
import logo from '../assets/Diario-r.png';

const AuthModals = ({ 
    isLoginModalOpen, 
    isRegisterModalOpen, 
    toggleLoginModal, 
    toggleRegisterModal, 
    handleLogin, 
    username, 
    setUsername, 
    password, 
    setPassword, 
    email, 
    setEmail 
}) => {
    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/register', {
                nombre: username,
                email: email,
                contrasena: password,
            });
            alert(response.data.message); // Muestra el mensaje de éxito
            toggleRegisterModal(); // Cierra el modal
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
            alert(error.response?.data?.error || 'Error en el servidor'); // Muestra un error
        }
    };

    return (
        <>
            {/* Login Modal */}
            {isLoginModalOpen && (
                <div 
                    className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-20"
                    aria-hidden={!isLoginModalOpen}
                    aria-modal="true"
                    role="dialog"
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <img src={logo} alt="Logo" className="mx-auto mb-4 w-32 h-32" />
                        <h2 className="text-xl font-semibold mb-4 text-center">Iniciar sesión</h2>
                        <label htmlFor="login-username" className="sr-only">Correo</label>
                        <input
                            id="login-username"
                            type="text"
                            placeholder="Correo"
                            className="w-full mb-3 p-2 border rounded-md focus:outline-none"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <label htmlFor="login-password" className="sr-only">Contraseña</label>
                        <input
                            id="login-password"
                            type="password"
                            placeholder="Contraseña"
                            className="w-full mb-4 p-2 border rounded-md focus:outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 mb-2"
                            onClick={handleLogin}
                        >
                            Entrar
                        </button>
                        <button
                            onClick={toggleLoginModal}
                            className="w-full text-gray-600 p-2 rounded-md hover:text-red-600"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* Register Modal */}
            {isRegisterModalOpen && (
                <div 
                    className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-20"
                    aria-hidden={!isRegisterModalOpen}
                    aria-modal="true"
                    role="dialog"
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <img src={logo} alt="Logo" className="mx-auto mb-4 w-32 h-32" />
                        <h2 className="text-xl font-semibold mb-4 text-center">Registrarse</h2>
                        <label htmlFor="register-username" className="sr-only">Nombre de usuario</label>
                        <input
                            id="register-username"
                            type="text"
                            placeholder="Nombre de usuario"
                            className="w-full mb-3 p-2 border rounded-md focus:outline-none"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <label htmlFor="register-email" className="sr-only">Correo electrónico</label>
                        <input
                            id="register-email"
                            type="email"
                            placeholder="Correo electrónico"
                            className="w-full mb-3 p-2 border rounded-md focus:outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="register-password" className="sr-only">Contraseña</label>
                        <input
                            id="register-password"
                            type="password"
                            placeholder="Contraseña"
                            className="w-full mb-4 p-2 border rounded-md focus:outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 mb-2"
                            onClick={handleRegister}
                        >
                            Registrar
                        </button>
                        <button
                            onClick={toggleRegisterModal}
                            className="w-full text-gray-600 p-2 rounded-md hover:text-red-600"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AuthModals;
