import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NoticiasRecientes = () => {
    const [noticiasRecientes, setNoticiasRecientes] = useState([]);

    useEffect(() => {
        const fetchNoticiasRecientes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/noticias-recientes');
                setNoticiasRecientes(response.data);
            } catch (error) {
                console.error('Error al obtener noticias recientes por categoría:', error);
            }
        };

        fetchNoticiasRecientes();
    }, []);

    const groupedNoticias = noticiasRecientes.reduce((acc, noticia) => {
        const { coleccion } = noticia;
        if (!acc[coleccion]) {
            acc[coleccion] = [];
        }
        acc[coleccion].push(noticia);
        return acc;
    }, {});

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Noticias Recientes por Categoría</h2>
            {Object.entries(groupedNoticias).map(([categoria, noticias]) => (
                <div key={categoria} className="mb-8">
                    <h3 className="text-xl font-semibold mb-2">{categoria}</h3>
                    <ul className="list-disc list-inside bg-gray-100 p-4 rounded shadow">
                        {noticias.map((noticia, index) => (
                            <li key={index} className="mb-2">
                                <strong>{noticia.titulo}</strong> - {noticia.fecha}
                                <br />
                                <span>{noticia.descripcion}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default NoticiasRecientes;
