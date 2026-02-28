// src/cruds/user-crud.js

const { db, admin } = require('../config/db');
const bcrypt = require('bcrypt');

// --- USERS COLLECTION ---

async function createUser(userId, userData) {
  try {
    // Email uniqueness check
    const existing = await db
      .collection('users')
      .where('email', '==', userData.email)
      .get();

    if (!existing.empty) {
      throw new Error('Email already in use.');
    }

    // Hash password
    userData.password = await bcrypt.hash(userData.password, 10);

    // Always initialize favorites empty
    const userDoc = {
      email: userData.email,
      name: userData.name,
      password: userData.password,
      membership: userData.membership || 'Basic',
      favorites: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Use UID as document ID (important for auth consistency)
    await db.collection('users').doc(userId).set(userDoc);

    return userId;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

async function getUser(userId) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) return undefined;

    const data = userDoc.data();

    // Never expose password
    const { password, ...safeUser } = data;

    return { id: userDoc.id, ...safeUser };
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

async function updateUser(userId, newData) {
  try {
    if (newData.password) {
      newData.password = await bcrypt.hash(newData.password, 10);
    }

    await db.collection('users').doc(userId).update({
      ...newData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

async function deleteUser(userId) {
  try {
    await db.collection('users').doc(userId).delete();
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// --- FAVORITES ---

async function addFavorite(userId, favoritePath) {
  try {
    const userRef = db.collection('users').doc(userId);
    const favoriteRef = db.doc(favoritePath);

    await userRef.update({
      favorites: admin.firestore.FieldValue.arrayUnion(favoriteRef)
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
}

async function removeFavorite(userId, favoritePath) {
  try {
    const userRef = db.collection('users').doc(userId);
    const favoriteRef = db.doc(favoritePath);

    await userRef.update({
      favorites: admin.firestore.FieldValue.arrayRemove(favoriteRef)
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
}

async function getFavorites(userId) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    const data = userDoc.data();

    if (!Array.isArray(data.favorites) || data.favorites.length === 0) {
      return [];
    }

    const favoritePromises = data.favorites
      .filter(ref => ref && typeof ref.get === 'function')
      .map(ref => ref.get());

    const favoriteDocs = await Promise.all(favoritePromises);

    return favoriteDocs
      .filter(doc => doc.exists)
      .map(doc => ({
        id: doc.id,
        path: doc.ref.path,
        ...doc.data()
      }));
  } catch (error) {
    console.error('Error getting favorites:', error);
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  addFavorite,
  removeFavorite,
  getFavorites
};