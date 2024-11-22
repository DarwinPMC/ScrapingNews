import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';

const TransmisionEnVivo = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);
    const liveVideoUrl = 'https://rtvelivestream.akamaized.net/rtvesec/24h/24h_main_dvr_576.m3u8';

    useEffect(() => {
        if (isPlaying && Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(liveVideoUrl);
            hls.attachMedia(videoRef.current);

            return () => hls.destroy();
        }
    }, [isPlaying]);

    const handlePlayLive = () => {
        setIsPlaying(true);
    };

    return (
        <div className="flex flex-col items-center mt-8">
            {!isPlaying && (
                <button
                    onClick={handlePlayLive}
                    className="px-6 py-3 bg-red-600 text-white text-lg font-bold rounded-lg hover:bg-red-700"
                >
                    En Vivo
                </button>
            )}
            {isPlaying && (
                <div className="mt-4 w-full max-w-3xl">
                    <h2 className="text-center text-lg font-bold mb-4 text-red-600">Transmisión en Vivo</h2>
                    <video
                        ref={videoRef}
                        controls
                        autoPlay
                        className="w-full rounded-lg shadow-lg"
                    >
                        Tu navegador no soporta este video.
                    </video>
                </div>
            )}
        </div>
    );
};

export default TransmisionEnVivo;
