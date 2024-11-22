import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const NoticiasAdmin = () => {
    const [noticias, setNoticias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editData, setEditData] = useState({ id: null, titulo: '', descripcion: '', fecha: '', fuente: '', image: '' });
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(4);

    useEffect(() => {
        const fetchNoticias = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/home');
                setNoticias(response.data);
            } catch (error) {
                console.error('Error al obtener las noticias:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNoticias();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta noticia?')) {
            try {
                await axios.delete(`http://localhost:5000/api/noticias/${id}`);
                setNoticias(noticias.filter(noticia => noticia.id !== id));
                alert('Noticia eliminada correctamente.');
            } catch (error) {
                console.error('Error al eliminar la noticia:', error);
                alert('Hubo un error al eliminar la noticia.');
            }
        }
    };

    const handleEdit = (id) => {
        const noticiaToEdit = noticias.find(noticia => noticia.id === id);
        setEditData({ ...noticiaToEdit });
        setShowEditModal(true);
    };

    const handleEditSubmit = async () => {
        try {
            await axios.put(`http://localhost:5000/api/noticias/${editData.id}`, editData);
            alert('Noticia actualizada correctamente.');
            setEditData({ id: null, titulo: '', descripcion: '', fecha: '', fuente: '', image: '' });
            setShowEditModal(false);
            const response = await axios.get('http://localhost:5000/api/home');
            setNoticias(response.data);
        } catch (error) {
            console.error('Error al actualizar la noticia:', error);
            alert('Hubo un error al actualizar la noticia.');
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(noticias);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Noticias');
        XLSX.writeFile(workbook, 'Noticias.xlsx');
    };

    const exportToPDF = () => {
        const doc = new jsPDF();

        // Título del documento
        doc.setFontSize(18);
        doc.text('Noticias Registradas', 14, 20);

        // Datos de la tabla
        const tableData = noticias.map(noticia => [
            noticia.id,
            noticia.titulo,
            noticia.descripcion,
            noticia.fecha,
            noticia.fuente
        ]);

        // Agregar la tabla
        doc.autoTable({
            head: [['ID', 'Título', 'Descripción', 'Fecha', 'Fuente']],
            body: tableData,
            startY: 30,
            theme: 'grid',
        });

        // Descargar el PDF
        doc.save('Noticias.pdf');
    };

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentNoticias = noticias.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(noticias.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const renderPagination = () => {
        const pageNumbers = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pageNumbers.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage > 3 && currentPage < totalPages - 2) {
                pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            } else {
                pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            }
        }
        return pageNumbers.map((num, index) => (
            <button
                key={index}
                onClick={() => typeof num === 'number' && paginate(num)}
                className={`px-3 py-1 mx-1 border rounded ${currentPage === num ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                disabled={typeof num !== 'number'}
            >
                {num}
            </button>
        ));
    };

    return (
        <div className="container mx-auto p-4 mt-20">
            <h1 className="text-3xl font-bold mb-4">Noticias Registradas</h1>
            <div className="flex justify-between mb-4">
                <div>
                    <label className="mr-2">Mostrar:</label>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(parseInt(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="p-2 border border-gray-300 rounded"
                    >
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
                </div>
                <div className="space-x-2">
                    <button
                        onClick={exportToExcel}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Exportar a Excel
                    </button>
                    <button
                        onClick={exportToPDF}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Exportar a PDF
                    </button>
                </div>
            </div>
            {isLoading ? (
                <p className="text-center text-gray-600">Cargando noticias...</p>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-yellow-100 border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border-b">ID</th>
                                    <th className="px-4 py-2 border-b">Título</th>
                                    <th className="px-4 py-2 border-b">Descripción</th>
                                    <th className="px-4 py-2 border-b">Fecha</th>
                                    <th className="px-4 py-2 border-b">Fuente</th>
                                    <th className="px-4 py-2 border-b">Operaciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentNoticias.map((noticia, index) => (
                                    <tr key={index} className="text-center">
                                        <td className="px-4 py-2 border-b">{noticia.id}</td>
                                        <td className="px-4 py-2 border-b">{noticia.titulo}</td>
                                        <td className="px-4 py-2 border-b">{truncateText(noticia.descripcion, 50)}</td>
                                        <td className="px-4 py-2 border-b">{noticia.fecha}</td>
                                        <td className="px-4 py-2 border-b">{noticia.fuente}</td>
                                        <td className="px-4 py-2 border-b">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => handleEdit(noticia.id)}
                                                    className="px-2 py-1 bg-green-400 text-white rounded hover:bg-yellow-600"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(noticia.id)}
                                                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center mt-4">{renderPagination()}</div>
                </>
            )}
        </div>
    );
};

export default NoticiasAdmin;
