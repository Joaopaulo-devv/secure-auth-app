const { verifyAccessToken } = require('../utils/jwt');

// Lê o token do cookie httpOnly (nunca do header/localStorage) e
// injeta req.userId pras rotas usarem na checagem de ownership.
function requireAuth(req, res, next) {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.sub;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

module.exports = requireAuth;
