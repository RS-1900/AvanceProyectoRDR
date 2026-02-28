const { db, admin } = require('../config/db');

const episodesCollection = db.collection('episodes');

/**
 * Episode structure:
 * {
 *   contentId: string,
 *   season: number,
 *   episodeNumber: number,
 *   title: string,
 *   videoUrl: string,
 *   thumbnail: string,
 *   createdAt: Timestamp
 * }
 */

async function createEpisode(contentId, episodeData) {
  try {
    const docRef = await episodesCollection.add({
      contentId,
      season: episodeData.season,
      episodeNumber: episodeData.episodeNumber,
      title: episodeData.title,
      videoUrl: episodeData.videoUrl,
      thumbnail: episodeData.thumbnail,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return docRef;
  } catch (error) {
    console.error('Error creating episode:', error);
    throw error;
  }
}

async function getEpisode(episodeId) {
  const doc = await episodesCollection.doc(episodeId).get();
  if (!doc.exists) return undefined;

  return { id: doc.id, ...doc.data() };
}

async function getEpisodesByContent(contentId) {
  const snapshot = await episodesCollection
    .where('contentId', '==', contentId)
    .orderBy('season')
    .orderBy('episodeNumber')
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

async function updateEpisode(episodeId, newData) {
  await episodesCollection.doc(episodeId).update({
    ...newData,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
}

async function deleteEpisode(episodeId) {
  await episodesCollection.doc(episodeId).delete();
}

module.exports = {
  createEpisode,
  getEpisode,
  getEpisodesByContent,
  updateEpisode,
  deleteEpisode
};