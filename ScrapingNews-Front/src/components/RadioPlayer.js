import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Hls from 'hls.js';
import { FaBroadcastTower } from 'react-icons/fa';

const RadioPlayer = ({ userRole }) => {
    const audioRef = useRef(null);
    const radioStreams = [
        { id: 1, name: "La Zona", url: "https://mdstrm.com/audio/5fada54116646e098d97e6a5/live.m3u8" },
        { id: 2, name: "Radio Oxigeno", url: "https://mdstrm.com/audio/5fab0687bcd6c2389ee9480c/live.m3u8" }
    ];
    const [isOpen, setIsOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeStream, setActiveStream] = useState(radioStreams[0]);
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); // Modal para usuarios no logueados

    const togglePlayerVisibility = () => {
        if (!userRole) {
            setIsInfoModalOpen(true); // Mostrar modal si no está logueado
        } else if (![1, 2, 4, 5].includes(userRole)) {
            setIsSubscriptionModalOpen(true); // Mostrar modal si el rol no está permitido
        } else {
            setIsOpen(!isOpen);
        }
    };

    const switchStream = (stream) => {
        if (activeStream.id !== stream.id) {
            setActiveStream(stream);
            setIsPlaying(false); // Reset play state
        }
    };

    useEffect(() => {
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(activeStream.url);
            hls.attachMedia(audioRef.current);
        } else if (audioRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            audioRef.current.src = activeStream.url;
        }
    }, [activeStream]);

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current
                    .play()
                    .then(() => setIsPlaying(true))
                    .catch(error => {
                        console.error("Playback failed:", error);
                    });
            }
        }
    };

    return (
        <div className="fixed right-0 bottom-0 p-4 flex flex-col items-center z-50">
            <button
                onClick={togglePlayerVisibility}
                className="bg-white p-2 rounded-full shadow-lg mb-2 hover:bg-gray-200"
                title={isOpen ? "Cerrar reproductor" : "Abrir reproductor"}
            >
                <FaBroadcastTower size={32} className="text-red-600" />
            </button>

            {isOpen && (
                <div className="bg-white p-4 shadow-lg rounded-lg w-64">
                    <h2 className="text-lg font-semibold mb-2">En Vivo</h2>
                    <div className="mb-4">
                        {radioStreams.map((stream) => (
                            <button
                                key={stream.id}
                                onClick={() => switchStream(stream)}
                                className={`block w-full text-left p-2 rounded ${activeStream.id === stream.id ? 'bg-blue-100' : ''}`}
                            >
                                {stream.name}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handlePlayPause}
                        className="text-blue-600 font-semibold mb-2"
                    >
                        {isPlaying ? "Pausar" : "Reproducir"}
                    </button>
                </div>
            )}

            {/* Modal de suscripción */}
            {isSubscriptionModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4">Suscríbete para Escuchar</h2>
                        <p className="text-gray-700 mb-4">
                            Debes suscribirte a uno de nuestros planes para escuchar la radio en vivo.
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

            {/* Modal para usuarios no logueados */}
            {isInfoModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4">Inicia sesión</h2>
                        <p className="text-gray-700 mb-4">
                            Debes iniciar sesión para acceder al reproductor de radio.
                        </p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsInfoModalOpen(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <audio ref={audioRef} style={{ display: 'none' }} />
        </div>
    );
};

export default RadioPlayer;
