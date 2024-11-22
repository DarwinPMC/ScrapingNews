import React from 'react';
import axios from 'axios';

const EnviarNoticias = () => {
    const handleSendNews = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/api/send-news',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert(response.data.message);
        } catch (error) {
            console.error('Error al enviar noticias:', error);
            alert('Error al enviar las noticias.');
        }
    };

    return (
        <div className="mt-4">
            <button
                onClick={handleSendNews}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Enviar Últimas Noticias
            </button>
        </div>
    );
};

export default EnviarNoticias;
