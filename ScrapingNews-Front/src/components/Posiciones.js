import React from 'react';
import NoticiasMasLeidas from './NoticiasMasLeidas'; // Importa el componente de NoticiasMásLeídas

const Posiciones = ({ posiciones }) => {
    return (
        <div className="w-1/4 p-4 pr-24">
            <h2 className="text-xl font-bold mb-4"></h2>
            {/*{posiciones.length > 0 ? (
                <table className="bg-white w-full rounded-lg shadow-md mb-4">
                    <thead>
                        <tr>
                            <th className="p-2 text-left">Pos</th>
                            <th className="p-2 text-left">Equipo</th>
                            <th className="p-2 text-left">J</th>
                            <th className="p-2 text-left">V</th>
                            <th className="p-2 text-left">E</th>
                            <th className="p-2 text-left">D</th>
                            <th className="p-2 text-left">DG</th>
                            <th className="p-2 text-left">PTS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posiciones.map((posicion, index) => (
                            <tr key={index} className="border-t">
                                <td className="p-2">{posicion.posicion}</td>
                                <td className="p-2 flex items-center">
                                    <img src={posicion.bandera_url} alt={posicion.equipo} className="w-5 h-5 mr-2" />
                                    {posicion.equipo}
                                </td>
                                <td className="p-2">{posicion.jugados}</td>
                                <td className="p-2">{posicion.victoria}</td>
                                <td className="p-2">{posicion.empate}</td>
                                <td className="p-2">{posicion.derrota}</td>
                                <td className="p-2">{posicion.diferencia_goles}</td>
                                <td className="p-2">{posicion.puntos}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-600">No se encontraron posiciones.</p>
            )}*/}

            {/* Sección de Noticias Más Leídas */}
            <NoticiasMasLeidas />
        </div>
    );
};

export default Posiciones;
