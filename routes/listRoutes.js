const express = require('express');
const { createList, addMovieToList, removeMovieFromList, getListById,removeList } = require('../controllers/listController');

const router = express.Router();

router.post('/create', createList);
router.post('/add', addMovieToList);
router.post('/remove', removeMovieFromList);
router.post('/delete', removeList);
router.get('/:id', getListById);

module.exports = router;
