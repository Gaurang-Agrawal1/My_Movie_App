const express = require('express');
const { searchMovies } = require('../controllers/movieController');
const { getUserLists } = require('../controllers/listController');

const router = express.Router();

router.get('/home', getUserLists);
router.get('/search', searchMovies);

module.exports = router;
