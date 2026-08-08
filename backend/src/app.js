const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

app.use(helmet()); // headers de segurança (CSP, HSTS, X-Frame-Options etc.)
app.use(express.json());
app.use(cookieParser());

// CORS explícito, nunca "*" quando se usa cookies/credenciais
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // ex: http://localhost:5173
    credentials: true,
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

module.exports = app;
