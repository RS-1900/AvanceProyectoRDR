const express = require('express');
const router = express.Router();
const authenticateToken = require('../config/authMiddleware');

const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  addFavorite,
  removeFavorite,
  getFavorites
} = require('../cruds/user-crud');

/**
 * POST /users
 * Create user
 * Assumes Firebase Auth already created the user
 * and req.user.uid exists
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { email, name, password, membership } = req.body;

    if (!email || !name || !password) {
      return res.status(400).send('Missing required fields.');
    }

    const userId = req.user.uid;

    await createUser(userId, {
      email,
      name,
      password,
      membership
    });

    res.status(201).send({ id: userId, message: 'User created successfully.' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Protect all routes below
router.use(authenticateToken);

router.get('/:id', async (req, res) => {
  try {
    if (req.user.uid !== req.params.id) {
      return res.status(403).send('Forbidden.');
    }

    const user = await getUser(req.params.id);

    if (!user) return res.status(404).send('User not found.');

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (req.user.uid !== req.params.id) {
      return res.status(403).send('Forbidden.');
    }

    await updateUser(req.params.id, req.body);

    res.status(200).send('User updated successfully.');
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (req.user.uid !== req.params.id) {
      return res.status(403).send('Forbidden.');
    }

    await deleteUser(req.params.id);

    res.status(200).send('User deleted successfully.');
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// --- FAVORITES ---

router.post('/:id/favorites', async (req, res) => {
  try {
    if (req.user.uid !== req.params.id) {
      return res.status(403).send('Forbidden.');
    }

    const { favoritePath } = req.body;

    if (!favoritePath) {
      return res.status(400).send('Missing favoritePath.');
    }

    await addFavorite(req.params.id, favoritePath);

    res.status(200).send('Favorite added successfully.');
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete('/:id/favorites', async (req, res) => {
  try {
    if (req.user.uid !== req.params.id) {
      return res.status(403).send('Forbidden.');
    }

    const { favoritePath } = req.body;

    if (!favoritePath) {
      return res.status(400).send('Missing favoritePath.');
    }

    await removeFavorite(req.params.id, favoritePath);

    res.status(200).send('Favorite removed successfully.');
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get('/:id/favorites', async (req, res) => {
  try {
    if (req.user.uid !== req.params.id) {
      return res.status(403).send('Forbidden.');
    }

    const favorites = await getFavorites(req.params.id);

    res.status(200).send(favorites);
  } catch (error) {
    if (error.message.includes('not found')) {
      res.status(404).send(error.message);
    } else {
      res.status(500).send({ error: error.message });
    }
  }
});

module.exports = router;