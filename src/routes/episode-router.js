const express = require('express');
const router = express.Router();
const authenticateToken = require('../config/authMiddleware');

const {
  createEpisode,
  getEpisode,
  getEpisodesByContent,
  updateEpisode,
  deleteEpisode
} = require('../cruds/episode-crud');

router.use(authenticateToken);

function requireAdmin(req, res) {
  if (req.user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required.' });
    return false;
  }
  return true;
}

/* ================= CREATE EPISODE ================= */

router.post('/', async (req, res) => {
  if (!requireAdmin(req, res)) return;

  const { contentId, season, episodeNumber, title, videoUrl, thumbnail } = req.body;

  if (!contentId || !season || !episodeNumber || !title || !videoUrl) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const docRef = await createEpisode(contentId, {
      season,
      episodeNumber,
      title,
      videoUrl,
      thumbnail
    });

    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ================= GET ONE ================= */

router.get('/:id', async (req, res) => {
  const episode = await getEpisode(req.params.id);

  if (!episode) {
    return res.status(404).json({ error: 'Episode not found.' });
  }

  res.json(episode);
});

/* ================= GET BY CONTENT ================= */

router.get('/content/:contentId', async (req, res) => {
  const episodes = await getEpisodesByContent(req.params.contentId);
  res.json(episodes);
});

/* ================= UPDATE ================= */

router.put('/:id', async (req, res) => {
  if (!requireAdmin(req, res)) return;

  await updateEpisode(req.params.id, req.body);
  res.json({ message: 'Episode updated.' });
});

/* ================= DELETE ================= */

router.delete('/:id', async (req, res) => {
  if (!requireAdmin(req, res)) return;

  await deleteEpisode(req.params.id);
  res.json({ message: 'Episode deleted.' });
});

module.exports = router;