import React, { useEffect } from 'react';
import axios from 'axios';

const ModalNoticia = ({ selectedNoticia, closeModal, categoryTitle }) => {
    // Usa useEffect sin condiciones
    useEffect(() => {
        if (selectedNoticia && selectedNoticia.id) {
            console.log('ID de la noticia en ModalNoticia:', selectedNoticia.id); // Verifica si el `id` es válido
            const incrementarVistas = async () => {
                try {
                    await axios.post(`http://localhost:5000/api/incrementar-vistas`, {
                        id: selectedNoticia.id
                    });
                } catch (error) {
                    console.error('Error al incrementar las vistas:', error.message);
                }
            };
    
            incrementarVistas();
        }
    }, [selectedNoticia]);
    

    // Retorna null si selectedNoticia es null
    if (!selectedNoticia) return null;

    const handleOutsideClick = (e) => {
        if (e.target.id === 'modal-overlay') {
            closeModal();
        }
    };

    return (
        <div
            id="modal-overlay"
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition duration-300"
            onClick={handleOutsideClick}
        >
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                <h3 className="text-xl text-gray-500 mb-2">{categoryTitle}</h3>
                <h2 className="text-3xl font-bold mb-4">{selectedNoticia.titulo}</h2>
                <img src={selectedNoticia.image} alt={selectedNoticia.titulo} className="w-full h-64 object-cover rounded-md mb-4" />
                <p className="text-gray-700">{selectedNoticia.descripcion}</p>
                <p className="text-sm text-gray-500 mt-4">
                    {new Date(selectedNoticia.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-xs text-blue-600 mt-2">
                                Fuente: <span className="font-medium">{selectedNoticia.fuente}</span>
                            </p>
            </div>
        </div>
    );
};

export default ModalNoticia;
