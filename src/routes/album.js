const express = require('express');
const { route } = require('../app');

const albumController = require('../controllers/album');

const router = express.Router();

router.get('/', albumController.returnedAlbums);

router.get('/:id', albumController.albumById);

router.patch('/:id', albumController.updateAlbum);

router.delete('/:id', albumController.deleteAlbum);

module.exports = router;
