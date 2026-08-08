const rateLimit = require('express-rate-limit');

// Limita tentativas de login/registro por IP, mitigando brute force
// e credential stuffing. 5 tentativas a cada 15min é um ponto de
// partida razoável — ajuste conforme o caso de uso.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Muitas tentativas. Tente novamente em alguns minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = authLimiter;
