// const MovieList = require('../models/MovieList');
// const Movie = require('../models/Movie');

// exports.createList = async (req, res) => {
//     const { name } = req.body;
//     const userId = req.user.id;
//     // Convert string value to boolean
//     // Assuming req.body.isPublic contains the value from the form
// const isPublic = req.body.isPublic === 'on' ? true : false;


//     try {
//         const list = new MovieList({ user: userId, name, isPublic });
//         await list.save();
//         res.redirect('/movies/home');
//     } catch (err) {
//         console.log(err);
//         res.status(500).send('Server error');
//     }
// };

// exports.addMovieToList = async (req, res) => {
//     const { listId, movieId } = req.body;

//     try {
//         const movie = await Movie.findOne({ imdbID: movieId });
//         const list = await MovieList.findById(listId);
//         console.log(listId);    
//         console.log(movieId);
//         if (!list) {
//             return res.status(404).send('List not found');
//         }

//         list.movies.push(movie);
//         await list.save();
//         res.redirect(`/lists/${listId}`);
//     } catch (err) {
//         console.log(err);
//         res.status(500).send('Server error');
//     }
// };

// exports.removeMovieFromList = async (req, res) => {
//     const { listId, movieId } = req.body;

//     try {
//         const list = await MovieList.findById(listId);

//         if (!list) {
//             return res.status(404).send('List not found');
//         }

//         list.movies = list.movies.filter(movie => movie.toString() !== movieId);
//         await list.save();
//         res.redirect(`/lists/${listId}`);
//     } catch (err) {
//         console.log(err);
//         res.status(500).send('Server error');
//     }
// };

// exports.getUserLists = async (req, res) => {
//     const userId = req.user.id;

//     try {
//         const lists = await MovieList.find({ user: userId });
//         res.render('movies/home', { lists });
//     } catch (err) {
//         console.log(err);
//         res.status(500).send('Server error');
//     }
// };

// exports.getListById = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const list = await MovieList.findById(id).populate('movies');
//         if (!list) {
//             return res.status(404).send('List not found');
//         }
//         res.render('movies/list', { list });
//     } catch (err) {
//         console.log(err);
//         res.status(500).send('Server error');
//     }
// };

const MovieList = require('../models/MovieList');
const Movie = require('../models/Movie');

exports.createList = async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id;
    const isPublic = req.body.isPublic === 'on' ? true : false;

    try {
        const list = new MovieList({ user: userId, name, isPublic });
        await list.save();
        res.redirect('/movies/home');
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
};

exports.addMovieToList = async (req, res) => {
    const { listId, movieId } = req.body;

    try {
        let movie = await Movie.findOne({ imdbID: movieId });
        if (!movie) {
            const response = await fetch(`http://www.omdbapi.com/?i=${movieId}&apikey=${process.env.OMDB_API_KEY}`);
            const data = await response.json();
            if (data.Response === 'False') {
                return res.status(404).send('Movie not found');
            }
            movie = new Movie({
                title: data.Title,
                year: data.Year,
                imdbID: data.imdbID
            });
            await movie.save();
        }

        const list = await MovieList.findById(listId);

        if (!list) {
            return res.status(404).send('List not found');
        }

        if (!list.movies.includes(movie._id)) {
            list.movies.push(movie._id);
            await list.save();
        }

        res.redirect(`/lists/${listId}`);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
};

exports.removeMovieFromList = async (req, res) => {
    const { listId, movieId } = req.body;

    try {
        const list = await MovieList.findById(listId);
        if (!list) {
            return res.status(404).send('List not found');
        }

        list.movies.pull(movieId);
        await list.save();

        res.redirect(`/lists/${listId}`);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
};
exports.getUserLists = async (req, res) => {
    const userId = req.user.id;

    try {
        const lists = await MovieList.find({ user: userId });
        res.render('movies/home', { lists });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
};

exports.getListById = async (req, res) => {
    const { id } = req.params;

    try {
        const list = await MovieList.findById(id).populate('movies');
        if (!list) {
            return res.status(404).send('List not found');
        }
        res.render('movies/list', { list });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
};


exports.removeList = async (req, res) => {
    const { listId } = req.body;

    try {
        await MovieList.findByIdAndDelete(listId);
        res.redirect('/movies/home');
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
};