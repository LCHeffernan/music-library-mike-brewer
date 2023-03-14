const { reset } = require('nodemon');
const db = require('../db/index');

const createAlbum = async (req, res) => {
  const { name, year } = req.body;
  try {
    const { rows: [artist] } = await db.query(
      `SELECT * FROM Artists WHERE id = ${req.params.id}`,
    );
    if (!artist) {
      res.sendStatus(404);
    }

    const { rows: [album] } = await db.query(
      'INSERT INTO Albums (name, year, artistId) VALUES ($1, $2, $3) RETURNING *',
      [name, year, req.params.id],
    );
    res.status(201).json(album);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const readAlbum = async (req, res) => {
  const { name, year } = req.body;
  try {
    const { rows: [albums] } = await db.query(
      `SELECT * FROM Albums WHERE ${req.params.id}`,
    );
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = { createAlbum, readAlbum };
