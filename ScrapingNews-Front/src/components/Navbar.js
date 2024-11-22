import React, { useState, useEffect, useRef } from 'react';
import { FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthModals from './AuthModals';
import logo from '../assets/Diario-r.png';

const Navbar = ({ setCategory }) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
    const [isClimaModalOpen, setIsClimaModalOpen] = useState(false); // Estado para el modal del clima
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); // Modal para "Inicie sesión"
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
    const [clima, setClima] = useState(null); // Estado para el clima
    const [ciudad, setCiudad] = useState('Lima'); // Estado para la ciudad
    const [ciudadInput, setCiudadInput] = useState(''); // Para el modal del clima

    const navigate = useNavigate();
    const userMenuRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios
                .get('http://localhost:5000/api/verify-role', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    setUserRole(response.data.rol);
                    setUserName(localStorage.getItem('userName'));
                    setLoggedIn(true);
                })
                .catch((error) => {
                    console.error('Error al verificar el rol:', error);
                    setLoggedIn(false);
                });
        }

        const handleStorageChange = () => {
            setLoggedIn(!!localStorage.getItem('token'));
            setUserName(localStorage.getItem('userName') || '');
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Fetch del clima
    useEffect(() => {
        const fetchClima = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/clima?ciudad=${ciudad}`);
                setClima(response.data);
            } catch (error) {
                console.error('Error al obtener el clima:', error);
            }
        };

        fetchClima();
    }, [ciudad]); // Se ejecuta cada vez que cambia la ciudad

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [userMenuRef]);

    const handleCategoryChange = (category) => {
        // Verificar si el usuario intenta acceder a la categoría internacionales
        if (category === 'internacionales') {
            if (!loggedIn || userRole === 3) {
                setIsSubscriptionModalOpen(true); // Mostrar modal de suscripción si no está logueado o si el rol es 3
                return; // Salir de la función
            }
        }
    
        // Cambiar la categoría si cumple con los requisitos
        setCategory(category);
    };

    const toggleLoginModal = () => {
        setIsLoginModalOpen(!isLoginModalOpen);
        setIsUserMenuOpen(false);
    };

    const toggleRegisterModal = () => {
        setIsRegisterModalOpen(!isRegisterModalOpen);
        setIsUserMenuOpen(false);
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                email: username,
                contrasena: password,
            });
            const { token, rol, nombre } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('userName', nombre);
            setUserRole(rol);
            setUserName(nombre);
            setLoggedIn(true);
            alert('Inicio de sesión exitoso');
            setIsLoginModalOpen(false);

            // Actualiza la página después de iniciar sesión
            window.location.reload();
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            alert('Usuario o contraseña incorrectos');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        setLoggedIn(false);
        setUserRole(null);
        setUserName('');
        alert('Cierre de sesión exitoso');
        navigate('/'); // Redirige al usuario a la página principal
    };

    const handleClimaModalSubmit = () => {
        setCiudad(ciudadInput); // Cambia la ciudad con el valor ingresado
        setIsClimaModalOpen(false); // Cierra el modal
    };

    const handleEnVivoClick = () => {
        if (!loggedIn) {
            setIsInfoModalOpen(true); // Mostrar modal si no está logueado
        } else if (userRole !== 5) {
            setIsSubscriptionModalOpen(true); // Mostrar modal si no es VIP
        } else {
            navigate('/envivo'); // Navegar a la transmisión en vivo
        }
    };

    const handleClimaClick = () => {
        if (!loggedIn) {
            setIsInfoModalOpen(true); // Muestra el modal informativo
        } else {
            setIsClimaModalOpen(true);
        }
    };

    return (
        <>
            <nav className="bg-yellow-400 fixed w-full shadow-md z-10">
                <div className="container mx-auto flex items-center justify-between p-4">
                    {/* Logo y título */}
                    <div
                        className="flex items-center text-xl font-bold cursor-pointer"
                        onClick={() => handleCategoryChange('home')}
                    >
                        <img src={logo} alt="Logo" className="w-14 h-14 mr-2" />
                        ScrapingNews
                    </div>

                    {/* Botones de navegación */}
                    <div className="flex space-x-4 flex-grow justify-center">
                        <button onClick={() => handleCategoryChange('home')} className="text-black-700 hover:text-blue-600">
                            Inicio
                        </button>
                        <button onClick={() => handleCategoryChange('politica')} className="text-black-700 hover:text-blue-600">
                            Política
                        </button>
                        <button onClick={() => handleCategoryChange('deportes')} className="text-black-700 hover:text-blue-600">
                            Deportes
                        </button>
                        <button
                            onClick={() => handleCategoryChange('internacionales')}
                            className="text-black-700 hover:text-blue-600"
                        >
                            Internacionales
                        </button>
                        <button onClick={handleEnVivoClick} className="text-red-600 font-bold hover:text-red-700">
                            
                        </button>
                    </div>

                    {/* Clima, Bienvenido y Usuario */}
                    <div className="flex items-center space-x-4">
                        {clima && (
                            <div
                                className="text-gray-700 cursor-pointer text-right truncate"
                                style={{ maxWidth: '150px', flexShrink: 0 }}
                                onClick={handleClimaClick} // Nuevo manejador
                            >
                                <p className="text-sm font-medium truncate">{clima.ciudad}</p>
                                <p className="text-xs truncate">
                                    {clima.temperatura}°C, {clima.condicion}
                                </p>
                            </div>
                        )}
                        {loggedIn && userName && (
                            <span className="text-gray-700 font-medium truncate">Bienvenido, {userName}</span>
                        )}


                        <div ref={userMenuRef} className="relative">
    <FaUser
        className="text-gray-700 cursor-pointer hover:text-blue-600"
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        size={24}
    />
    {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
            <div className="flex flex-col items-start">
                {loggedIn ? (
                    <>
                        {(userRole === 1 || userRole === 2) && (
                            <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">
                                Panel
                            </Link>
                        )}
                        {/* Opción "Cuenta" para roles 3, 4, y 5 */}
                        {(userRole === 3 || userRole === 4 || userRole === 5) && (
                            <Link to="/cuenta" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">
                                Cuenta
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left"
                        >
                            Cerrar sesión
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={toggleLoginModal}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left"
                        >
                            Iniciar sesión
                        </button>
                        <button
                            onClick={toggleRegisterModal}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left"
                        >
                            Registrarse
                        </button>
                    </>
                )}
            </div>
        </div>
    )}
</div>
                    </div>
                </div>
            </nav>

            {/* Modal de Suscripción */}
            {isSubscriptionModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4">Suscríbete para Acceder</h2>
                        <p className="text-gray-700 mb-4">
                            Debes suscribirte a uno de nuestros planes para acceder a esta sección.
                        </p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsSubscriptionModalOpen(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                                Cerrar
                            </button>
                            <Link
                                to="/cuenta"
                                className="px-4 py-2 ml-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                onClick={() => setIsSubscriptionModalOpen(false)}
                            >
                                Suscribirse
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para cambiar la ciudad del clima */}
            {isClimaModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded shadow-lg w-96">
                        <h2 className="text-lg font-semibold mb-4">Cambiar Ciudad</h2>
                        <input
                            type="text"
                            value={ciudadInput}
                            onChange={(e) => setCiudadInput(e.target.value)}
                            placeholder="Nombre de la ciudad"
                            className="border w-full p-2 rounded mb-4"
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                                onClick={handleClimaModalSubmit}
                            >
                                Guardar
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-400 text-white rounded"
                                onClick={() => setIsClimaModalOpen(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal informativo para iniciar sesión */}
            {isInfoModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded shadow-lg w-96">
                        <h2 className="text-lg font-semibold mb-4">Inicie Sesión</h2>
                        <p className="mb-4">Debe iniciar sesión para usar esta funcionalidad.</p>
                        <div className="flex justify-end">
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                                onClick={() => setIsInfoModalOpen(false)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AuthModals
                isLoginModalOpen={isLoginModalOpen}
                isRegisterModalOpen={isRegisterModalOpen}
                toggleLoginModal={toggleLoginModal}
                toggleRegisterModal={toggleRegisterModal}
                handleLogin={handleLogin}
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                email={email}
                setEmail={setEmail}
            />
        </>
    );
};

export default Navbar;
