const mongoose = require('mongoose');

const MovieListSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    movies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ],
    isPublic: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('MovieList', MovieListSchema);
