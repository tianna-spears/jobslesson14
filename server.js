require('dotenv').config()

const express = require('express')
const app = express()
const connectDB = require('./db/connectDB')
const jobRouter = require('./routes/jobs')
const authMiddleware = require('./middleware/auth')
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const path = require('path');

const port = 4000

const csrfProtection = csrf({ cookie: true });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware
app.use(helmet());
app.use(xss());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// routes
app.use('/', (req, res) => {
    res.redirect('/jobs')
})

app.use('/jobs', authMiddleware, csrfProtection, jobRouter)

const start = async (req, res) => {
    try {
        await connectDB()
        
        app.listen( port, () => {
        console.log(`Server is listening on Port: ${port}`)}
    )
    } catch (error) {
        console.log( error )
    }
}

start()