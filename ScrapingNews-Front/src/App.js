import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import RadioPlayer from './components/RadioPlayer';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Noticias from './components/Noticias';
import Partidos from './components/Partidos';
import Posiciones from './components/Posiciones';
import ModalNoticia from './components/ModalNoticia';
import PrivateRoute from './components/PrivateRoute';
import Usuarios from './components/Usuarios';
import NoticiasAdmin from './components/noticiasadmin';
import Comentarios from './components/Comentarios';
import Envivo from './components/Envivo';
import Cuenta from './components/Cuenta';
import Sidebar from './components/Sidebar';
import AuthModals from './components/AuthModals'; // Importa el componente de modales de autenticación
import NoticiasMasLeidas from './components/NoticiasMasLeidas';

const App = () => {
    const [noticias, setNoticias] = useState([]);
    const [filteredNoticias, setFilteredNoticias] = useState([]);
    const [noticiasMasLeidas, setNoticiasMasLeidas] = useState([]); // Estado para las noticias más leídas
    const [category, setCategory] = useState('home');
    const [selectedNoticia, setSelectedNoticia] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [partidos, setPartidos] = useState([]);
    const [posiciones, setPosiciones] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const location = useLocation();

    const showSidebar = ['/dashboard', '/usuarios', '/noticiasadmin'].includes(location.pathname);

    const categoryTitles = {
        home: "Todas las Noticias",
        politica: "Política",
        deportes: "Deportes",
        internacionales: "Internacionales"
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:5000/api/verify-role', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                setUserRole(response.data.rol);
                setIsLoggedIn(true);
            })
            .catch(error => {
                console.error('Error al verificar el rol:', error.message);
                setIsLoggedIn(false);
            });
        }
    }, []);

    useEffect(() => {
        const fetchPosiciones = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/posiciones');
                if (!response.ok) {
                    throw new Error(`Error en la respuesta de la API: ${response.statusText}`);
                }
                const data = await response.json();
                setPosiciones(data);
            } catch (error) {
                console.error('Error al obtener posiciones:', error.message);
            }
        };
        fetchPosiciones();
    }, []);

    useEffect(() => {
        const fetchNoticias = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/${category}`);
                if (!response.ok) {
                    throw new Error(`Error en la respuesta de la API: ${response.statusText}`);
                }
                const data = await response.json();
                setNoticias(data);
                setFilteredNoticias(data);
            } catch (error) {
                console.error('Error al obtener noticias:', error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNoticias();
    }, [category]);

    useEffect(() => {
        const fetchPartidos = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/partidos');
                if (!response.ok) {
                    throw new Error(`Error en la respuesta de la API: ${response.statusText}`);
                }
                const data = await response.json();
                setPartidos(data);
            } catch (error) {
                console.error('Error al obtener partidos:', error.message);
            }
        };
        fetchPartidos();
    }, []);

    useEffect(() => {
        const filterBySearchAndDate = () => {
            let filtered = noticias;

            if (searchText) {
                filtered = filtered.filter(noticia =>
                    noticia.titulo.toLowerCase().includes(searchText.toLowerCase())
                );
            }

            if (startDate) {
                filtered = filtered.filter(noticia =>
                    new Date(noticia.fecha) >= new Date(startDate)
                );
            }

            if (endDate) {
                filtered = filtered.filter(noticia =>
                    new Date(noticia.fecha) <= new Date(endDate)
                );
            }

            setFilteredNoticias(filtered);
        };

        filterBySearchAndDate();
    }, [searchText, startDate, endDate, noticias]);

    const openModal = (noticia) => {
        setSelectedNoticia(noticia);
    };

    const closeModal = () => {
        setSelectedNoticia(null);
    };

    const toggleLoginModal = () => {
        setIsLoginModalOpen(!isLoginModalOpen);
    };

    const toggleRegisterModal = () => {
        setIsRegisterModalOpen(!isRegisterModalOpen);
    };

    const handleLogin = () => {
        // Lógica de inicio de sesión
        setIsLoggedIn(true);
        setIsLoginModalOpen(false);
    };

    const handleRegister = () => {
        // Lógica de registro
        setIsRegisterModalOpen(false);
    };

    return (
        <>
            <Navbar setCategory={setCategory} userRole={userRole} isLoggedIn={isLoggedIn} />
            <div className="flex">
                {showSidebar && <Sidebar userRole={userRole} />}
                <div className="flex-1">
                    <Routes>
                        <Route path="/" element={
                            <div className="bg-gray-100 min-h-screen">
                                <div className="flex pt-24">
                                <div className="flex flex-col w-full md:w-1/4">
                                    {/*<Partidos partidos={partidos} />*/}

                                    {/* Comentarios debajo de Próximos Partidos */}
                                    <Comentarios userRole={userRole} />
                                </div>
                                    <Noticias 
                                        category={category}
                                        noticias={filteredNoticias}
                                        isLoading={isLoading}
                                        openModal={openModal}
                                        categoryTitles={categoryTitles}
                                        searchText={searchText}
                                        setSearchText={setSearchText}
                                        startDate={startDate}
                                        setStartDate={setStartDate}
                                        endDate={endDate}
                                        setEndDate={setEndDate}
                                        isLoggedIn={isLoggedIn}
                                        toggleLoginModal={toggleLoginModal}
                                        handleLogin={handleLogin}   
                                    />
                                    <Posiciones posiciones={posiciones} />
                                </div>
                                {/* <NoticiasMasLeidas noticias={noticiasMasLeidas} /> Añade el componente aquí */}
                                {/*<RadioPlayer userRole={userRole} />*/}
                                
                            </div>
                        } />
                        <Route path="/dashboard" 
        element={
            <PrivateRoute userRole={userRole} allowedRoles={[1, 2]}>
                <Dashboard />
            </PrivateRoute>
        } 
    />
    <Route path="/usuarios" 
        element={
            <PrivateRoute userRole={userRole} allowedRoles={[1, 2]}>
                <Usuarios />
            </PrivateRoute>
        } 
    />
    <Route path="/noticiasadmin" 
        element={
            <PrivateRoute userRole={userRole} allowedRoles={[1, 2]}>
                <NoticiasAdmin />
            </PrivateRoute>
        } 
    />
    <Route path="/cuenta" 
        element={
            <PrivateRoute userRole={userRole} allowedRoles={[3, 4, 5]}>
                <Cuenta />
            </PrivateRoute>
        } 
    />
    <Route path="/envivo" element={<Envivo />} />
                    </Routes>
                    <ModalNoticia selectedNoticia={selectedNoticia} closeModal={closeModal} categoryTitle={categoryTitles[category]} />
                </div>
            </div>

            {/* Modales de autenticación */}
            <AuthModals
                isLoginModalOpen={isLoginModalOpen}
                isRegisterModalOpen={isRegisterModalOpen}
                toggleLoginModal={toggleLoginModal}
                toggleRegisterModal={toggleRegisterModal}
                handleLogin={handleLogin}
                handleRegister={handleRegister}
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

export default App;
