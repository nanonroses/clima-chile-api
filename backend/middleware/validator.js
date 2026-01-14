import { param, validationResult } from 'express-validator';

// Middleware para manejar errores de validación
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Parámetros inválidos',
      errors: errors.array()
    });
  }
  next();
};

// Validadores para diferentes parámetros
export const validators = {
  // Validar código de estación meteorológica (4 caracteres alfanuméricos)
  stationCode: [
    param('code')
      .trim()
      .isAlphanumeric()
      .isLength({ min: 4, max: 4 })
      .withMessage('El código de estación debe tener 4 caracteres alfanuméricos'),
    handleValidationErrors
  ],

  // Validar año (entre 2000 y 2100)
  year: [
    param('year')
      .isInt({ min: 2000, max: 2100 })
      .withMessage('El año debe estar entre 2000 y 2100'),
    handleValidationErrors
  ],

  // Validar tipo de indicador económico
  indicatorType: [
    param('type')
      .trim()
      .toLowerCase()
      .isIn(['dolar', 'euro', 'uf', 'utm', 'ipc'])
      .withMessage('Tipo de indicador inválido. Opciones: dolar, euro, uf, utm, ipc'),
    handleValidationErrors
  ],

  // Validar fecha (formato YYYY-MM-DD)
  date: [
    param('date')
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Formato de fecha inválido. Use YYYY-MM-DD'),
    handleValidationErrors
  ]
};
