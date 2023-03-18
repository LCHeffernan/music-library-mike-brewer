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

const returnedAlbums = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM Albums');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const albumById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM Albums');
    const { rows: [album] } = await db.query('SELECT * FROM Albums WHERE id = $1', [id]);

    if (!album) {
      res.status(404).json({ message: `The album ID: ${id} does not exist` });
    }
    res.status(200).json(album);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const updateAlbum = async (req, res) => {
  const { id } = req.params;
  const { name, year } = req.body;

  let query; let
    params;

  if (name && year) {
    query = 'UPDATE Albums SET name = $1, year = $2 WHERE id = $3 RETURNING *';
    params = [name, year, id];
  } else if (name) {
    query = 'UPDATE Albums SET name = $1 WHERE id = $2 RETURNING *';
    params = [name, id];
  } else if (year) {
    query = 'UPDATE Albums SET year = $1 WHERE id = $2 RETURNING *';
    params = [year, id];
  }

  try {
    const { rows: [artist] } = await db.query(query, params);

    if (!artist) {
      return res.status(404).json({ message: `album ${id} does not exist` });
    }

    res.status(200).json(artist);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = { createAlbum, returnedAlbums, albumById, updateAlbum };
