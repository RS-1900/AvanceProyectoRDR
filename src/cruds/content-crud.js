// src/cruds/content-crud.js

const { db, admin } = require('../config/db');

const contentCollection = db.collection('content');
const episodesCollection = db.collection('episodes');

/* ================= CONTENT ================= */

async function createContent(contentData) {
  const docRef = await contentCollection.add({
    title: contentData.title,
    description: contentData.description,
    isMovie: contentData.isMovie,
    thumbnail: contentData.thumbnail,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return docRef;
}

async function getAllContent() {
  const snapshot = await contentCollection.get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

async function getContent(contentId) {
  const doc = await contentCollection.doc(contentId).get();

  if (!doc.exists) return undefined;

  return { id: doc.id, ...doc.data() };
}

async function getContentByTitle(title) {
  const snapshot = await contentCollection
    .where('title', '==', title)
    .limit(1)
    .get();

  if (snapshot.empty) return undefined;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

async function updateContent(contentId, newData) {
  await contentCollection.doc(contentId).update({
    ...newData,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
}

async function deleteContent(contentId) {
  await contentCollection.doc(contentId).delete();

  const snapshot = await db
    .collection('episodes')
    .where('contentId', '==', contentId)
    .get();

  const batch = db.batch();
  snapshot.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
}
module.exports = {
  createContent,
  getAllContent,
  getContent,
  getContentByTitle,
  updateContent,
  deleteContent
};