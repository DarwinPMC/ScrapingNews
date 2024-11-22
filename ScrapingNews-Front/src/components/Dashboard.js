import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const [allNoticias, setAllNoticias] = useState([]);
    const [noticiaCount, setNoticiaCount] = useState(0);
    const [deportesCount, setDeportesCount] = useState(0);
    const [politicaCount, setPoliticaCount] = useState(0);
    const [totalNoticias, setTotalNoticias] = useState(0);
    const [isScraping, setIsScraping] = useState(false);
    const [noticiasPorFuente, setNoticiasPorFuente] = useState([]);
    const [masLeidas, setMasLeidas] = useState([]); // Estado para las noticias más leídas
    const [dailyReport, setDailyReport] = useState([]);
    const [weeklyReport, setWeeklyReport] = useState([]);
    const [monthlyReport, setMonthlyReport] = useState([]);

    useEffect(() => {
        const fetchAllNoticias = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/home');
                const noticias = response.data;

                setAllNoticias(noticias);
                setTotalNoticias(noticias.length);
            } catch (error) {
                console.error('Error al obtener todas las noticias:', error);
            }
        };

        

        const fetchNoticiasCountByCategory = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/noticias/count');
                const counts = response.data;

                counts.forEach(item => {
                    if (item.coleccion === 'noticia') {
                        setNoticiaCount(item.total);
                    } else if (item.coleccion === 'deportes') {
                        setDeportesCount(item.total);
                    } else if (item.coleccion === 'politica') {
                        setPoliticaCount(item.total);
                    }
                });
            } catch (error) {
                console.error('Error al obtener el conteo de noticias por categoría:', error);
            }
        };

        const fetchNoticiasPorFuente = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/noticias/fuente-count');
                setNoticiasPorFuente(response.data);
            } catch (error) {
                console.error('Error al obtener el conteo de noticias por fuente:', error);
            }
        };

        const fetchMasLeidas = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/noticias-mas-leidas');
                setMasLeidas(response.data);
            } catch (error) {
                console.error('Error al obtener las noticias más leídas:', error);
            }
        };

        const fetchDailyReport = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/noticias/count-daily');
                setDailyReport(response.data);
            } catch (error) {
                console.error('Error al obtener el reporte diario:', error);
            }
        };

        fetchAllNoticias();
        fetchNoticiasCountByCategory();
        fetchNoticiasPorFuente();
        fetchMasLeidas();
        fetchDailyReport();
    }, []);

    const handleScrape = async () => {
        setIsScraping(true);
        try {
            const response = await axios.post('http://localhost:5000/api/scrape');
            alert(response.data.message);
        } catch (error) {
            alert('Error al iniciar el scraping');
            console.error('Error al iniciar el scraping:', error);
        } finally {
            setIsScraping(false);
        }
    };

    

    const generateChartData = (report, labelKey, dataKey) => ({
        labels: report.map(item => item[labelKey]),
        datasets: [
            {
                label: 'Cantidad de Noticias',
                data: report.map(item => item[dataKey]),
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    });

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: { size: 14 },
                    color: '#333',
                    stepSize: 10,
                },
            },
            x: {
                ticks: {
                    font: { size: 14 },
                    color: '#333',
                },
            },
        },
        plugins: {
            legend: {
                position: 'top',
                labels: { font: { size: 16 }, color: '#333' },
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.raw} Noticias`,
                },
            },
        },
    };

    const barrChartData = {
        labels: ['Noticia', 'Deportes', 'Política'],
        datasets: [
            {
                label: 'Cantidad de Noticias',
                data: [noticiaCount, deportesCount, politicaCount],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)', 
                    'rgba(255, 99, 132, 0.8)', 
                    'rgba(255, 206, 86, 0.8)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 2,
                barPercentage: 0.6,
            },
        ],
    };

    

    const barChartData = {
        labels: ['Noticia', 'Deportes', 'Política'],
        datasets: [
            {
                label: 'Cantidad de Noticias',
                data: [noticiaCount, deportesCount, politicaCount],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',  // Azul para "Noticia"
                    'rgba(255, 99, 132, 0.8)',  // Rojo para "Deportes"
                    'rgba(255, 206, 86, 0.8)'   // Amarillo para "Política"
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 2,
                barPercentage: 0.6,
                hoverBackgroundColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                hoverBorderColor: [
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(255, 206, 86, 0.8)'
                ],
                hoverBorderWidth: 3
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: { size: 14 },
                    color: '#333',
                    stepSize: 10,
                },
            },
            x: {
                ticks: {
                    font: { size: 14 },
                    color: '#333',
                },
            },
        },
        plugins: {
            legend: {
                position: 'top',
                labels: { font: { size: 16 }, color: '#333' },
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.raw} Noticias`,
                },
            },
        },
    };

    const pieChartData = {
        labels: ['Noticia', 'Deportes', 'Política'],
        datasets: [
            {
                label: 'Distribución de Noticias',
                data: [noticiaCount, deportesCount, politicaCount],
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
            },
        ],
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom' },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.raw} Noticias`,
                },
            },
        },
    };

    const doughnutChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom' },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.raw} Noticias`,
                },
            },
        },
    };

    const sourceChartData = {
        labels: noticiasPorFuente.map(item => item.fuente),
        datasets: [
            {
                label: 'Noticias por Fuente',
                data: noticiasPorFuente.map(item => item.total),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="container mx-auto p-4 max-h-screen overflow-y-auto">
            <h1 className="text-3xl font-bold mb-4">Bienvenido al Dashboard</h1>
            <p className="mb-4">Esta es la sección del Dashboard para usuarios con rol de administrador.</p>

            <button
                onClick={handleScrape}
                className={`p-2 mb-4 bg-blue-600 text-white rounded ${isScraping ? 'opacity-50' : ''}`}
                disabled={isScraping}
            >
                {isScraping ? 'Scrapeando...' : 'Iniciar Scraping'}
            </button>

            <div className="mb-8 grid grid-cols-4 gap-4">
                <div className="p-4 bg-purple-200 rounded shadow">
                    <h3 className="text-xl font-bold">Total de Noticias</h3>
                    <p className="text-2xl">{totalNoticias}</p>
                </div>
                <div className="p-4 bg-blue-300 rounded shadow">
                    <h3 className="text-xl font-bold">Noticias Generales</h3>
                    <p className="text-2xl">{noticiaCount}</p>
                </div>
                <div className="p-4 bg-red-300 rounded shadow">
                    <h3 className="text-xl font-bold">Noticias de Deportes</h3>
                    <p className="text-2xl">{deportesCount}</p>
                </div>
                <div className="p-4 bg-yellow-200 rounded shadow">
                    <h3 className="text-xl font-bold">Noticias de Política</h3>
                    <p className="text-2xl">{politicaCount}</p>
                </div>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-4">
                <div className="p-4 bg-white shadow rounded max-h-64 overflow-hidden">
                    <h2 className="text-xl font-semibold mb-2">Visualización de Noticias</h2>
                    <div style={{ height: '200px' }}>
                        <Bar data={barChartData} options={barChartOptions} />
                    </div>
                </div>
                <div className="p-4 bg-white shadow rounded max-h-64 overflow-hidden">
                    <h2 className="text-xl font-semibold mb-2">Distribución de Noticias</h2>
                    <div style={{ height: '200px' }}>
                        <Pie data={pieChartData} options={pieChartOptions} />
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Noticias por Fuente</h2>
                <div className="p-4 bg-white shadow rounded max-h-64 overflow-hidden">
                    <Doughnut data={sourceChartData} options={doughnutChartOptions} />
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Reporte Diario</h2>
                <div className="p-4 bg-white shadow rounded max-h-64 overflow-hidden">
                    <Bar
                        data={generateChartData(dailyReport, 'dia', 'total')}
                        options={chartOptions}
                    />
                </div>
            </div>

            

            <div className="mb-8 grid grid-cols-2 gap-4">
    {/* Últimas Noticias */}
    <div className="p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 border-b-2 pb-2 border-gray-200">Últimas Noticias</h2>
        <ul className="space-y-3">
            {allNoticias.slice(0, 5).map((noticia, index) => (
                <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                    </div>
                    <div>
                        <p className="text-lg font-medium text-gray-900">{noticia.titulo}</p>
                        <p className="text-sm text-gray-500">Fecha: {new Date(noticia.fecha).toLocaleDateString()}</p>
                    </div>
                </li>
            ))}
        </ul>
    </div>

    {/* Noticias Más Leídas */}
    <div className="p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 border-b-2 pb-2 border-gray-200">Noticias Más Leídas</h2>
        <ul className="space-y-3">
            {masLeidas.slice(0, 5).map((noticia, index) => (
                <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                    </div>
                    <div>
                        <p className="text-lg font-medium text-gray-900">{noticia.titulo}</p>
                        <p className="text-sm text-gray-500">Vistas: {noticia.views}</p>
                    </div>
                </li>
            ))}
        </ul>
    </div>


            </div>
        </div>
    );
};

export default Dashboard;
