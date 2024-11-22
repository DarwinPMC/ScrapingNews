// components/Partidos.js
import React from 'react';

const Partidos = ({ partidos }) => {
    return (
        <div className="bg-white shadow rounded p-4 ml-9">
            <h2 className="text-xl font-bold mb-4">a</h2>
            {partidos.length > 0 ? (
                partidos.map((partido, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <img src={partido.logo_local} alt="Local" className="w-12 h-12 object-cover" />
                            <span className="text-sm font-semibold text-center">{partido.estado}</span>
                            <img src={partido.logo_visitante} alt="Visitante" className="w-12 h-12 object-cover" />
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                            {partido.fecha} - {partido.hora}
                        </p>
                    </div>
                ))
            ) : (
                <p className="text-gray-600">No se encontraron partidos.</p>
            )}
        </div>
    );
};

export default Partidos;
