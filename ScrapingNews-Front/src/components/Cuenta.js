import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import Reporte from './Reporte'; // Importa el componente Reporte

const Cuenta = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [showPlanes, setShowPlanes] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null); // Plan seleccionado
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // Modal de pago

    const planesDetalles = [
        { nombre: 'Suscriptor', precio: 10, rol: 4, beneficios: ['Contenido exclusivo', 'Sin anuncios'] },
        { nombre: 'VIP', precio: 20, rol: 5, beneficios: ['Contenido exclusivo', 'Sin anuncios', 'Eventos premium'] },
    ];

    const getPlanName = (role) => {
        switch (role) {
            case 3:
                return 'Usuario';
            case 4:
                return 'Suscriptor';
            case 5:
                return 'VIP';
            default:
                return 'Desconocido';
        }
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:5000/api/user-details', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const { nombre, rol } = response.data;
                    setUserName(nombre);
                    setUserRole(rol);
                } catch (error) {
                    console.error('Error al obtener detalles del usuario:', error);
                }
            } else {
                console.warn('No se encontró token en el almacenamiento local.');
            }
        };

        fetchUserDetails();
    }, []);

    const handlePlanSelection = (plan) => {
        setSelectedPlan(plan);
        setIsPaymentModalOpen(true); // Abre el modal de pago
    };

    const closePaymentModal = () => {
        setIsPaymentModalOpen(false);
        setSelectedPlan(null); // Limpia el plan seleccionado
    };

    const updateUserRole = async (rol) => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await axios.put(
                    'http://localhost:5000/api/update-role',
                    { rol },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert('Plan actualizado con éxito.');
                setUserRole(rol); // Actualiza el rol en el frontend
                closePaymentModal();
            } catch (error) {
                console.error('Error al actualizar el rol:', error);
                alert('No se pudo actualizar el plan.');
            }
        }
    };

    return (
        <div className="container mx-auto mt-28 p-6 bg-white shadow rounded relative">
            {/* Botón Volver */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
                <FaArrowLeft className="text-xl" />
            </button>

            <h1 className="text-2xl font-bold mb-4 mt-4">Mi Cuenta</h1>
            <div className="space-y-4">
                <p className="text-gray-700"><strong>Nombre:</strong> {userName || 'Cargando...'}</p>
                <p className="text-gray-700"><strong>Plan Actual:</strong> {getPlanName(userRole)}</p>
                <button
                    onClick={() => setShowPlanes(!showPlanes)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    {showPlanes ? 'Ocultar Planes' : 'Ver Planes'}
                </button>
            </div>

            {showPlanes && (
                <div className="mt-8 grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                    {planesDetalles.map((plan, index) => (
                        <div
                            key={index}
                            className="p-6 border rounded shadow bg-gray-50 cursor-pointer hover:shadow-lg transition duration-200"
                            onClick={() => handlePlanSelection(plan)}
                        >
                            <h2 className="text-xl font-semibold text-gray-800">{plan.nombre}</h2>
                            <p className="text-lg text-blue-600 font-bold">${plan.precio}/mes</p>
                            <ul className="mt-4 list-disc list-inside text-gray-700">
                                {plan.beneficios.map((beneficio, i) => (
                                    <li key={i}>{beneficio}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de Pago con PayPal */}
            {isPaymentModalOpen && selectedPlan && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4 text-center">Completa tu compra</h2>
                        <p className="text-gray-700 mb-2"><strong>Plan:</strong> {selectedPlan.nombre}</p>
                        <p className="text-gray-700 mb-4"><strong>Precio:</strong> ${selectedPlan.precio}</p>

                        <PayPalScriptProvider options={{ "client-id": "Af6fp7jcwBoFcGPlIxJAVaopWw68NGG8KGhIWH-gRUbBp84Q2xYP1oVJaXbjexJ-YqopQPccp6myy8RE" }}>
                            <PayPalButtons
                                style={{ layout: 'vertical' }}
                                createOrder={(data, actions) => {
                                    return actions.order.create({
                                        purchase_units: [
                                            {
                                                amount: { value: selectedPlan.precio.toString() },
                                            },
                                        ],
                                    });
                                }}
                                onApprove={(data, actions) => {
                                    return actions.order.capture().then(() => {
                                        updateUserRole(selectedPlan.rol); // Actualiza el rol del usuario
                                    });
                                }}
                                onError={(err) => {
                                    console.error('Error en el pago:', err);
                                    alert('Hubo un error en el pago. Inténtalo de nuevo.');
                                }}
                            />
                        </PayPalScriptProvider>

                        <button
                            className="w-full py-2 mt-4 bg-gray-400 text-white rounded hover:bg-gray-500"
                            onClick={closePaymentModal}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Sección de Reporte */}
            <Reporte />
        </div>
    );
};

export default Cuenta;
