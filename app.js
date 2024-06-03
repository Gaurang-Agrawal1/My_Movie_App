const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const dbConnect = require("./config/db");
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const listRoutes = require('./routes/listRoutes');
const { ensureAuth } = require('./middleware/authMiddleware');

dotenv.config();

const app = express();


dbConnect();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(path.join(__dirname, 'public'))); //static files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/movies', ensureAuth, movieRoutes);
app.use('/lists', ensureAuth, listRoutes);

app.get('/', (req, res) => {
    res.redirect('/auth/login');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
