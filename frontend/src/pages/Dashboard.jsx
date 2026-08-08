import { useEffect, useState } from 'react';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostForm from '../components/PostForm';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const { user, doLogout } = useAuth();

  async function loadPosts() {
    const data = await api.getMyPosts();
    setPosts(data);
  }

  useEffect(() => {
    loadPosts().catch(console.error);
  }, []);

  async function handleCreate({ title, content }) {
    await api.createPost(title, content);
    await loadPosts();
  }

  async function handleUpdate({ title, content }) {
    await api.updatePost(editingPost.id, title, content);
    setEditingPost(null);
    await loadPosts();
  }

  return (
    <div>
      <h1>Olá, {user?.name}</h1>
      <button onClick={doLogout}>Sair</button>

      <h2>{editingPost ? 'Editar post' : 'Novo post'}</h2>
      <PostForm
        key={editingPost?.id || 'new'}
        initialData={editingPost}
        onSubmit={editingPost ? handleUpdate : handleCreate}
        onCancel={editingPost ? () => setEditingPost(null) : undefined}
      />

      <h2>Meus posts</h2>
      <ul>
        {posts.map((p) => (
          <li key={p.id}>
            <strong>{p.title}</strong>
            <button onClick={() => setEditingPost(p)}>Editar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
