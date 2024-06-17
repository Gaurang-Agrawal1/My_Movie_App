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
        const lists = await MovieList.find({});
        const userId = req.user.id;
    
        // Filter lists: include public lists or lists created by the current user
        const filteredLists = lists.filter(list => list.isPublic || list.user.toString() === userId);
    
        // Make the OMDB API request
        const response = await axios.get(`http://www.omdbapi.com/?s=${title}&apikey=${process.env.OMDB_API_KEY}`);
        const data = response.data;
    
        if (data.Response === 'False') {
            return res.render('movies/search', { movies: [], lists: filteredLists });
        }
    
        res.render('movies/search', { movies: data.Search, lists: filteredLists });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
};
