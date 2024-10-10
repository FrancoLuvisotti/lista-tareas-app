const authMiddleware = (req, res, next) => {
    if (req.session.userId) { //*verifica si el id de usuario esta en la sesion
        next(); // si esta autenticado pasa al siguiente middle o ruta
    } else {
        res.redirect('/login');
    }
};

module.exports = authMiddleware;