import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../assets/Diario-r.png';


const Reporte = () => {
    const [reporte, setReporte] = useState([]);
    const [userRole, setUserRole] = useState(null); // Estado para el rol del usuario
    const [isLoading, setIsLoading] = useState(true); // Estado para manejar la carga de datos
    const [userId, setUserId] = useState(null); // ID del usuario logueado
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false); // Estado para el modal de suscripción

    const logoBase64 = 'data:image/png;base64,ENCODED_LOGO_HERE'; // Reemplaza ENCODED_LOGO_HERE con tu logo en base64

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No se encontró token en el almacenamiento local.');
                setIsLoading(false);
                return;
            }

            try {
                // Obtén los datos del usuario logueado
                const userResponse = await axios.get('http://localhost:5000/api/verify-role', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const { rol, user_id } = userResponse.data;
                setUserRole(rol); // Establece el rol del usuario
                setUserId(user_id); // Establece el ID del usuario logueado

                // Ahora obtén el reporte con el ID del usuario logueado
                const reportResponse = await axios.get(`http://localhost:5000/api/noticias/reporte?id_usuario=${user_id}`);
                setReporte(reportResponse.data);
            } catch (error) {
                console.error('Error al obtener datos del usuario o reporte:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleGeneratePDF = () => {
        if (userRole !== 5) {
            setIsSubscriptionModalOpen(true); // Mostrar modal si el usuario no tiene el rol adecuado
            return;
        }
    
        const doc = new jsPDF();
    
        // Carga el logo desde el archivo y lo agrega al PDF
        const img = new Image();
        img.src = logo;
        img.onload = () => {
            doc.addImage(img, 'PNG', 10, 10, 30, 30); // Ajusta las coordenadas (10, 10) y el tamaño (30, 30) según sea necesario
            doc.setFontSize(20);
            doc.text('Diario Mani', 50, 25);
    
            // Título del documento
            doc.setFontSize(16);
            doc.text('Reporte de Noticias Vistas', 14, 50);
    
            // Generar tabla con los datos
            autoTable(doc, {
                startY: 60,
                head: [['Título', 'Fecha Vista']],
                body: reporte.map((vista) => [
                    vista.titulo,
                    new Date(vista.fecha_vista).toLocaleString(),
                ]),
            });
    
            // Guardar el archivo PDF
            doc.save('reporte_noticias.pdf');
        };
    };
    return (
        <div className="container mx-auto mt-8 p-4 bg-white shadow rounded">
            <h1 className="text-xl font-bold mb-4">Reporte de Noticias Vistas</h1>
            {reporte.length > 0 ? (
                reporte.map((vista, index) => (
                    <div key={index} className="mb-4">
                        <h3 className="text-lg">{vista.titulo}</h3>
                        <p className="text-sm text-gray-600">
                            Visto el: {new Date(vista.fecha_vista).toLocaleString()}
                        </p>
                    </div>
                ))
            ) : (
                <p>No hay noticias vistas para este usuario.</p>
            )}
            <button
                onClick={handleGeneratePDF}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Generar Reporte PDF
            </button>

            {/* Modal de suscripción */}
            {isSubscriptionModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4">Actualiza a Plan VIP</h2>
                        <p className="text-gray-700 mb-4">
                            Solo los usuarios con el plan VIP pueden generar reportes en PDF.
                        </p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsSubscriptionModalOpen(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reporte;
