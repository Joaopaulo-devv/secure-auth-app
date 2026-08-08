const db = require('../config/db');

async function createPost(req, res) {
  const { title, content } = req.body;
  const [result] = await db.query(
    'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)',
    [req.userId, title, content]
  );
  return res.status(201).json({ id: result.insertId, title, content });
}

async function listMyPosts(req, res) {
  const [rows] = await db.query(
    'SELECT * FROM posts WHERE user_id = ?',
    [req.userId]
  );
  return res.json(rows);
}

async function updatePost(req, res) {
  const { id } = req.params;

  // *** Aqui está a proteção contra IDOR ***
  // Nunca confie só no ID vindo da URL. Sempre confirme que o
  // recurso pertence ao usuário autenticado (req.userId, que veio
  // do JWT validado, não de algo que o cliente pode manipular).
  const [rows] = await db.query('SELECT user_id FROM posts WHERE id = ?', [id]);
  const post = rows[0];

  if (!post) {
    return res.status(404).json({ error: 'Post não encontrado' });
  }
  if (post.user_id !== req.userId) {
    // Mesmo tipo de falha que costuma aparecer em endpoint de
    // progresso/ranking quando não se valida o dono do recurso.
    return res.status(403).json({ error: 'Sem permissão para editar este post' });
  }

  const { title, content } = req.body;
  await db.query('UPDATE posts SET title = ?, content = ? WHERE id = ?', [
    title,
    content,
    id,
  ]);
  return res.json({ ok: true });
}

module.exports = { createPost, listMyPosts, updatePost };
