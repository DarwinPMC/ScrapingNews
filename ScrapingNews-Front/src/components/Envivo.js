import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hls from 'hls.js';
import axios from 'axios';
import logo from '../assets/Diario-r.png'; // Asegúrate de importar tu logo

const Envivo = () => {
    const liveVideoUrl = 'https://ztnr.rtve.es/ztnr/1694255.m3u8'; // Enlace HLS
    const videoRef = useRef(null);
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const [error, setError] = useState('');

    // Obtén el rol del usuario desde el backend
    useEffect(() => {
        const fetchUserRole = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Debe iniciar sesión para acceder a la transmisión.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/verify-role', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserRole(response.data.rol);
            } catch (err) {
                console.error('Error al obtener el rol del usuario:', err);
                setError('No se pudo verificar el rol del usuario.');
            }
        };

        fetchUserRole();
    }, []);

    useEffect(() => {
        if (userRole === 5 && videoRef.current) {
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(liveVideoUrl);
                hls.attachMedia(videoRef.current);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    videoRef.current.play();
                });
            } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                videoRef.current.src = liveVideoUrl;
                videoRef.current.play();
            }
        }
    }, [userRole]);

    if (error || userRole !== 5) {
        return (
            <div className="flex flex-col items-center mt-8 p-4">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Acceso Restringido</h1>
                <p className="text-gray-700">
                    {error || 'Solo los usuarios con el rol VIP pueden acceder a la transmisión en vivo.'}
                </p>
                <button
                    onClick={() => navigate('/')} // Redirige a la raíz
                    className="mt-6 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700"
                >
                    Volver al Inicio
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center mt-20 p-4">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Transmisión en Vivo</h1>
            <div className="relative w-full max-w-4xl px-4">
                {/* Contenedor relativo para posicionar el logo */}
                <video
                    ref={videoRef}
                    controls
                    autoPlay
                    width="100%"
                    className="rounded-lg shadow-lg bg-black"
                ></video>
                {/* Logo posicionado en la esquina superior izquierda */}
                <div
                    className="absolute top-4 left-4 w-16 h-16 bg-white rounded-full flex items-center justify-center animate-spin"
                    style={{ animationDuration: '5s' }}
                >
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-20 h-20 object-contain"
                    />
                </div>
            </div>
            <button
                onClick={() => navigate('/')} // Redirige a la raíz
                className="mt-6 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700"
            >
                Volver al Inicio
            </button>
        </div>
    );
};

export default Envivo;
