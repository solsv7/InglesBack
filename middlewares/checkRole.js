const checkRole = (requiredRole) => (req, res, next) => {
    // Verificar si el usuario está autenticado y tiene rol
    if (!req.user || !req.user.role) {
        return res.status(403).json({ message: 'Acceso denegado: Rol no especificado' });
    }

    // Verificar si el rol del usuario coincide con el requerido
    if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: 'Acceso denegado: Permisos insuficientes' });
    }

    next(); // Continuar si el rol es válido
};

module.exports = checkRole;