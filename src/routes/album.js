const express = require('express');
const { route } = require('../app');

const albumController = require('../controllers/album');

const router = express.Router();

router.get('/', albumController.readAlbum);

module.exports = router;