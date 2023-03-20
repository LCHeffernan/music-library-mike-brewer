const express = require('express');
const { route } = require('../app');

const artistController = require('../controllers/artist');

const albumController = require('../controllers/album');

const router = express.Router();

router.post('/', artistController.createArtist);

router.get('/', artistController.getAllArtists);

router.get('/:id', artistController.getSingleArtist);

router.patch('/:id', artistController.updateArtist);

router.delete('/:id', artistController.deleteArtist);

router.post('/:id/albums', albumController.createAlbum);

module.exports = router;
