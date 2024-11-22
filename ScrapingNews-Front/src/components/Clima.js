import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Clima = () => {
    const [clima, setClima] = useState(null);
    const [ciudad, setCiudad] = useState('Lima');

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
    }, [ciudad]);

    return (
        <div>
            <h2>Clima en {ciudad}</h2>
            {clima ? (
                <ul>
                    <li>Temperatura: {clima.temperatura}°C</li>
                    <li>Condición: {clima.condicion}</li>
                    <li>Humedad: {clima.humedad}%</li>
                    <li>Viento: {clima.viento_kph} km/h</li>
                </ul>
            ) : (
                <p>Cargando clima...</p>
            )}
            <input
                type="text"
                placeholder="Cambiar ciudad"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
            />
        </div>
    );
};

export default Clima;
