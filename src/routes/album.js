const express = require('express');
const { route } = require('../app');

const albumController = require('../controllers/album');

const router = express.Router();

router.get('/', albumController.returnedAlbums);

router.get('/:id', albumController.albumById);

module.exports = router;
