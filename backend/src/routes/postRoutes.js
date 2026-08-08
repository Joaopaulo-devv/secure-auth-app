const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/authMiddleware');
const { createPost, listMyPosts, updatePost } = require('../controllers/postController');

// Todas as rotas abaixo exigem JWT válido
router.use(requireAuth);

router.post('/', createPost);
router.get('/', listMyPosts);
router.put('/:id', updatePost);

module.exports = router;
