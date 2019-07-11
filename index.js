require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const MOVIES = require('./movies-data.json')

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

app.use(function validateBearerToken(req, res, next) {
    const authCode = req.get('Authorization');
    const apiToken = process.env.API_TOKEN;
    if (!authCode || authCode.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request'})
    }
    next()
})

app.get('/', (req, res) => {
    res.send('yolo')
})

function getMovie(req, res) {
    let response = MOVIES;
    const { genre, country, avg_vote } = req.query;
    if (genre) {
        response = response.filter(movie => movie.genre.toLowerCase().includes(genre.trim().toLowerCase()))
    }
    if (country) {
        response = response.filter(movie => movie.country.toLowerCase().includes(country.trim().toLowerCase()))
    }
    if (avg_vote) {
        response = response.filter(movie => movie.avg_vote >= Number(avg_vote))
    }
    res.json(response);
}

app.get('/movie', getMovie)

app.listen(8000, () => {
    console.log('server running 8000')
})