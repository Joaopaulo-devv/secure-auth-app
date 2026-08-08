const bcrypt = require('bcrypt');
const { createUser, findUserByEmail } = require('../models/userModel');
const { registerSchema, loginSchema } = require('../utils/validators');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/jwt');

const COOKIE_OPTS = {
  httpOnly: true, // JS do front não consegue ler -> mitiga roubo via XSS
  secure: process.env.NODE_ENV === 'production', // só HTTPS em produção
  sameSite: 'strict', // mitiga CSRF
};

async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }
  const { name, email, password } = parsed.data;

  const existing = await findUserByEmail(email);
  if (existing) {
    // Mensagem genérica, não revela se o email já existe (evita
    // enumeração de usuários - a mesma falha que você já achou
    // em outro projeto, aqui já nasce corrigida).
    return res.status(400).json({ error: 'Não foi possível criar a conta' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const userId = await createUser(name, email, passwordHash);

  return res.status(201).json({ id: userId, name, email });
}

async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Credenciais inválidas' });
  }
  const { email, password } = parsed.data;

  const user = await findUserByEmail(email);
  // Mensagem idêntica pros dois casos (usuário não existe / senha
  // errada) — de novo, evita enumeração de usuários.
  if (!user) {
    return res.status(401).json({ error: 'Email ou senha incorretos' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Email ou senha incorretos' });
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  res.cookie('accessToken', accessToken, { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { ...COOKIE_OPTS, maxAge: 7 * 24 * 60 * 60 * 1000 });

  return res.json({ id: user.id, name: user.name, email: user.email });
}

async function refresh(req, res) {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ error: 'Não autenticado' });

  try {
    const payload = verifyRefreshToken(token);
    const newAccessToken = generateAccessToken(payload.sub);
    res.cookie('accessToken', newAccessToken, { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(401).json({ error: 'Sessão expirada, faça login novamente' });
  }
}

async function logout(req, res) {
  res.clearCookie('accessToken', COOKIE_OPTS);
  res.clearCookie('refreshToken', COOKIE_OPTS);
  return res.json({ ok: true });
}

module.exports = { register, login, refresh, logout };
