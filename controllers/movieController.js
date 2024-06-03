const axios = require('axios');
const Movie = require('../models/Movie');
const MovieList = require('../models/MovieList'); // Add this line

exports.searchMovies = async (req, res) => {
    const { title } = req.query;

    if (!title) {
        return res.render('movies/search', { movies: [], lists: [] }); 
    }

    try {
        // Fetch all lists
        const lists = await MovieList.find({}); // Modify this to fetch all lists

        const response = await axios.get(`http://www.omdbapi.com/?s=${title}&apikey=${process.env.OMDB_API_KEY}`);
        const data = response.data;
        if (data.Response === 'False') {
            return res.render('movies/search', { movies: [], lists: lists }); // Pass fetched lists
        }
        res.render('movies/search', { movies: data.Search, lists: lists }); // Pass fetched lists
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
};
