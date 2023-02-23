const db = require('../db/index');

const createArtist = async (req, res) => {
  const { name, genre } = req.body;

  try {
    const { rows: [artist] } = await db.query('INSERT INTO Artists (name, genre) VALUES ($1, $2) RETURNING *', [name, genre]);
    res.status(201).json(artist);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getAllArtists = async (_, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM Artists');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getSingleArtist = async (req, res) => {
  try {
    const { rows } = await db.query(`SELECT * FROM Artists WHERE id = ${req.params.id}`);
    if (rows[0]) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: `artist ${req.params.id} does not exist` });
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = { createArtist, getAllArtists, getSingleArtist };
