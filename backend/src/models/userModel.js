const db = require('../config/db');

// IMPORTANTE: sempre usar "?" (prepared statements), NUNCA concatenar
// strings direto na query. Isso é o que previne SQL Injection.

async function createUser(name, email, passwordHash) {
  const [result] = await db.query(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  );
  return result.insertId;
}

async function findUserByEmail(email) {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0];
}

async function findUserById(id) {
  const [rows] = await db.query(
    'SELECT id, name, email FROM users WHERE id = ?', // nunca retornar password_hash
    [id]
  );
  return rows[0];
}

module.exports = { createUser, findUserByEmail, findUserById };
