var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const bodyParser = require('body-parser');
const mysql = require('mysql2');

var app = express();

const cors = require('cors');
app.use(cors());


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '',
  database: 'regionsquiz',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the database');
  }
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Define routes for each page
app.get('/', (req, res) => {
  res.render('index');
});
app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/country', (req, res) => {
  res.render('country');
});


app.get('/country/:region', (req, res) => {
  const region = req.params.region;
  console.log('Requested region:', region);
  const query = "SELECT * FROM RegionsQuiz WHERE region = ?";

  db.query(query, [region], (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).send('Error fetching quiz questions.');
    }
  
    console.log('Query results:', results);
    res.render('country', { questions: results, region: region });
  });
  
});



app.post('/check-answer', (req, res) => {
  const questionId = req.body.questionId;
  const userAnswer = req.body.answer;

  const query = 'SELECT answer FROM RegionsQuiz WHERE id = ?';

  db.query(query, [questionId], (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).send('Error checking answer.');
    }

    const correctAnswer = results[0].answer;

    if (userAnswer === correctAnswer) {
      res.send('Correct!');
    } else {
      res.send('Incorrect.');
    }
  });
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;