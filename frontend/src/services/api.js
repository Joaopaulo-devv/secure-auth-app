const BASE_URL = 'http://localhost:3000/api';

// credentials: 'include' é essencial -> é o que faz o navegador
// enviar e receber o cookie httpOnly com o JWT.
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro na requisição');
  return data;
}

export const register = (name, email, password) =>
  request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });

export const login = (email, password) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const logout = () => request('/auth/logout', { method: 'POST' });

export const getMyPosts = () => request('/posts');

export const createPost = (title, content) =>
  request('/posts', { method: 'POST', body: JSON.stringify({ title, content }) });

export const updatePost = (id, title, content) =>
  request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify({ title, content }) });
