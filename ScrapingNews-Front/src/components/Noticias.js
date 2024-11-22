import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Noticias = ({
    category,
    noticias,
    isLoading,
    openModal,
    categoryTitles,
    searchText,
    setSearchText,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isLoggedIn,
    userRole, // Rol del usuario
    toggleLoginModal // Función para abrir el modal de inicio de sesión
}) => {
    const [filteredNoticias, setFilteredNoticias] = useState([]);
    const [visibleNoticias, setVisibleNoticias] = useState(10);
    const [showLoginReminder, setShowLoginReminder] = useState(false);

    useEffect(() => {
        const filterBySearchAndDate = () => {
            let filtered = noticias;

            if (searchText) {
                filtered = filtered.filter(noticia =>
                    noticia.titulo.toLowerCase().includes(searchText.toLowerCase())
                );
            }

            if (startDate) {
                filtered = filtered.filter(noticia =>
                    new Date(noticia.fecha) >= new Date(startDate)
                );
            }

            if (endDate) {
                filtered = filtered.filter(noticia =>
                    new Date(noticia.fecha) <= new Date(endDate)
                );
            }

            setFilteredNoticias(filtered);
        };

        filterBySearchAndDate();
    }, [searchText, startDate, endDate, noticias]);

    useEffect(() => {
        if (!isLoggedIn) {
            setSearchText(''); // Limpia el texto de búsqueda si el usuario no está logueado
            setStartDate(''); // Limpia la fecha de inicio
            setEndDate(''); // Limpia la fecha de fin
        }
    }, [isLoggedIn]);

    const handleLoadMore = () => {
        if (isLoggedIn) {
            setVisibleNoticias(prev => prev + 10);
        } else {
            // Desplaza la página hacia arriba y muestra un recordatorio de inicio de sesión
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setShowLoginReminder(true);
        }
    };

    const closeLoginReminder = (e) => {
        if (e.target === e.currentTarget) {
            setShowLoginReminder(false);
        }
    };

    // Exportar a Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredNoticias);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Noticias');
        XLSX.writeFile(workbook, 'noticias.xlsx');
    };

    // Exportar a PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ['Título', 'Descripción', 'Fecha', 'Fuente'];
        const tableRows = filteredNoticias.map(noticia => [
            noticia.titulo,
            noticia.descripcion,
            new Date(noticia.fecha).toLocaleDateString('es-ES'),
            noticia.fuente
        ]);

        doc.text('Reporte de Noticias', 14, 20);
        autoTable(doc, { startY: 30, head: [tableColumn], body: tableRows });
        doc.save('noticias.pdf');
    };

    return (
        <div className="flex-1 p-4 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-6">
                {categoryTitles[category]}
            </h1>

            {/* Modal de recordatorio para iniciar sesión */}
            {showLoginReminder && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
                    onClick={closeLoginReminder}
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-lg font-semibold mb-4">Inicia sesión</h2>
                        <p className="mb-4">Por favor, inicia sesión para ver más noticias.</p>
                    </div>
                </div>
            )}

            {/* Mostrar barra de búsqueda y filtros solo si el usuario está logueado */}
            {isLoggedIn && (
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-300 p-4 rounded-lg shadow-md">
                        {/* Campo de búsqueda */}
                        <div className="w-full sm:w-1/3">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Buscar noticias:</label>
                            <input
                                type="text"
                                placeholder="Escribe para buscar..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Filtro de fecha de inicio */}
                        <div className="w-full sm:w-1/3">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de inicio:</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Filtro de fecha de fin */}
                        <div className="w-full sm:w-1/3">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de fin:</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>


                   {/* Botones de exportación visibles solo para rol 5 */}
                   { visibleNoticias < filteredNoticias.length &&(
                        <div className="mt-4 flex justify-end gap-4">
                            <button
                                onClick={exportToExcel}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Exportar a Excel
                            </button>
                            <button
                                onClick={exportToPDF}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Exportar a PDF
                            </button>
                        </div>
                    )}
                </div>
            )}

            {isLoading ? (
                <p className="text-center text-gray-600 p-4">Cargando noticias...</p>
            ) : filteredNoticias.length > 0 ? (
                <div>
                    {/* Mostrar la noticia principal */}
                    {filteredNoticias.length > 0 && (
                        <div
                            className="mb-4 bg-white p-4 rounded-lg shadow-md cursor-pointer transition duration-300 hover:shadow-lg"
                            onClick={() => openModal(filteredNoticias[0])}
                        >
                            <img src={filteredNoticias[0].image} alt={filteredNoticias[0].titulo} className="w-full h-64 object-cover rounded-lg" />
                            <h2 className="text-2xl font-bold mt-2">{filteredNoticias[0].titulo}</h2>
                            <p className="text-gray-700 mt-1">{filteredNoticias[0].descripcion}</p>
                        </div>
                    )}

                    {/* Mostrar las demás noticias hasta el límite visible */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredNoticias.slice(1, visibleNoticias).map((noticia, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-lg shadow-md cursor-pointer transition duration-300 hover:shadow-lg"
                                onClick={() => openModal(noticia)}
                            >
                                <img src={noticia.image} alt={noticia.titulo} className="w-full h-32 object-cover rounded-md" />
                                <h3 className="font-semibold mt-2">{noticia.titulo}</h3>
                                <p className="text-gray-600 text-sm mt-1">{noticia.descripcion.slice(0, 100)}...</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {new Date(noticia.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </p>
                                <p className="text-xs text-blue-600 mt-2">
                                    Fuente: <span className="font-medium">{noticia.fuente}</span>
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Botón de cargar más */}
                    {visibleNoticias < filteredNoticias.length && (
                        <button
                            onClick={handleLoadMore}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Cargar más
                        </button>
                    )}
                </div>
            ) : (
                <p className="text-center text-gray-600 p-4">No se encontraron noticias.</p>
            )}
        </div>
    );
};

export default Noticias;
