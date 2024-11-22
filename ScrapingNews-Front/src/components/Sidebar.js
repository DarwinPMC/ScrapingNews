import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ userRole }) => {
    return (
        <aside className="w-64 bg-gray-800 text-white h-screen p-4 mt-20">
            <h2 className="text-2xl font-bold mb-4">ScrapingNews</h2>
            <ul>
                {/* Mostrar todos los botones si el rol es 1 */}
                {userRole === 1 && (
                    <>
                        <li className="mb-2">
                            <Link to="/dashboard" className="block p-2 bg-gray-700 rounded hover:bg-gray-600">
                                Dashboard
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link to="/noticiasadmin" className="block p-2 bg-gray-700 rounded hover:bg-gray-600">
                                Noticias
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link to="/usuarios" className="block p-2 bg-gray-700 rounded hover:bg-gray-600">
                                Usuarios
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link to="/" className="block p-2 bg-gray-700 rounded hover:bg-gray-600">
                                Diario
                            </Link>
                        </li>
                    </>
                )}

                {/* Mostrar solo Dashboard, Noticias y Diario si el rol es 2 */}
                {userRole === 2 && (
                    <>
                        <li className="mb-2">
                            <Link to="/dashboard" className="block p-2 bg-gray-700 rounded hover:bg-gray-600">
                                Dashboard
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link to="/noticiasadmin" className="block p-2 bg-gray-700 rounded hover:bg-gray-600">
                                Noticias
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link to="/" className="block p-2 bg-gray-700 rounded hover:bg-gray-600">
                                Diario
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </aside>
    );
};

export default Sidebar;
