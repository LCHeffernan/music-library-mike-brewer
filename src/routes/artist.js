const express = require('express');

const artistController = require('../controllers/artist');

const router = express.Router();

router.post('/', artistController.createArtist);

router.get('/', artistController.getAllArtists);

router.get('/:id', artistController.getSingleArtist);

module.exports = router;
