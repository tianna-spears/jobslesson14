require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const connectDB = require('./db/connectDB');
const jobRouter = require('./routes/jobs');
const passportInit = require('./passport/passportInit');
// const csrf = require('host-csrf');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const requireAuth = require('./middleware/auth');
const sessionRouter = require('./routes/session');

const app = express();
const port = 5000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret123',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

passportInit();
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// // CSRF protection 
// let csrfDevelopmentMode = true;
// if (app.get('env') === 'production') {
//   csrfDevelopmentMode = false;
//   app.set('trust proxy', 1);
// }

// const csrfMiddleware = csrf({
//   protected_operations: ['POST', 'PUT', 'PATCH', 'DELETE'],
//   protected_content_types: ['application/x-www-form-urlencoded'],
//   developer_mode: csrfDevelopmentMode,
//   cookieParams: {
//     sameSite: 'Strict',
//   },
// });
// app.use(csrfMiddleware);

app.use((req, res, next) => {
//   res.locals._csrf = req.csrfToken();
  res.locals.errors = req.flash('error');
  res.locals.info = req.flash('info');
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use('/sessions', sessionRouter);

app.get('/home', (req, res) => {
  res.json('home page');
});

app.use('/jobs', requireAuth, jobRouter);

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
