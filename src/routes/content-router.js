const express = require('express');
const router = express.Router();
const authenticateToken = require('../config/authMiddleware');

const {
  createContent,
  getAllContent,
  getContent,
  getContentByTitle,
  updateContent,
  deleteContent
} = require('../cruds/content-crud');

router.use(authenticateToken);

function requireAdmin(req, res) {
  if (req.user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required.' });
    return false;
  }
  return true;
}

/* ================= CONTENT ROUTES ================= */

router.post('/', async (req, res) => {
  if (!requireAdmin(req, res)) return;

  try {
    const { title, description, thumbnail, isMovie } = req.body;

    if (!title || !description || typeof isMovie !== 'boolean') {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const docRef = await createContent({
      title,
      description,
      thumbnail,
      isMovie
    });

    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  const content = await getAllContent();
  res.json(content);
});

router.get('/title/:title', async (req, res) => {
  const content = await getContentByTitle(req.params.title);

  if (!content) {
    return res.status(404).json({ error: 'Content not found.' });
  }

  res.json(content);
});

router.get('/:id', async (req, res) => {
  const content = await getContent(req.params.id);

  if (!content) {
    return res.status(404).json({ error: 'Content not found.' });
  }

  res.json(content);
});

router.put('/:id', async (req, res) => {
  if (!requireAdmin(req, res)) return;

  await updateContent(req.params.id, req.body);
  res.json({ message: 'Content updated.' });
});

router.delete('/:id', async (req, res) => {
  if (!requireAdmin(req, res)) return;

  await deleteContent(req.params.id);
  res.json({ message: 'Content and episodes deleted.' });
});

module.exports = router;