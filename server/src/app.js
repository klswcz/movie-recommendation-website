const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const expressJwt = require('express-jwt')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api')
const dotenv = require('dotenv').config()
const passport = require('passport');

const app = express()
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});
app.use(morgan('tiny'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_APP_URL
}))

const jwtMiddleware = expressJwt({
    secret: process.env.JWT_SECRET, algorithms: ['RS256']
});

mongoose.connect(process.env.DB_HOST, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true)

app.use(apiRoutes)

app.listen(process.env.APP_PORT)

module.exports = app
