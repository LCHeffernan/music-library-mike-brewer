const { reset } = require('nodemon');
const db = require('../db/index');

const createAlbum = async (req, res) => {
  const { name, year } = req.body;
  console.log(req.params.id);
  try {
    const data = await db.query(
      `SELECT * FROM Artists WHERE id = ${req.params.id}`,
    );

    if (!data) {
      res.status(404);
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

module.exports = { createAlbum };
