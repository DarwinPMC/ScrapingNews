import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ userRole, allowedRoles, children }) => {
    if (!allowedRoles.includes(userRole)) {
        // Si el rol del usuario no está en la lista de roles permitidos, redirige a la página principal
        return <Navigate to="/" replace />;
    }
    // Si el rol está permitido, renderiza el contenido de la ruta
    return children;
};

export default PrivateRoute;
