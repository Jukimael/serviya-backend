const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Error de PostgreSQL
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        return res.status(409).json({
          success: false,
          message: 'El registro ya existe'
        });
      case '23503': // Foreign key violation
        return res.status(400).json({
          success: false,
          message: 'Violación de clave foránea'
        });
      default:
        return res.status(500).json({
          success: false,
          message: 'Error en la base de datos'
        });
    }
  }

  // Error genérico
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;