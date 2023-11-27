var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const bodyParser = require('body-parser');
const mysql = require('mysql2');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = '12345';
var saltRounds = 10;

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

function generateToken(username) {
  const payload = { username };
  const options = { expiresIn: '5m' }; // Token expiration time
  return jwt.sign(payload, secretKey, options); 
}

function verifyToken(token) { try {
  const decoded = jwt.verify(token, secretKey);
  return decoded.username; } catch (err) {
  return null; // Token is invalid or expired }
  }
}


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
  const jwt = req.cookies.jwt;
  console.log(jwt);
  if(jwt){
    var username = verifyToken(jwt);
    console.log(username);
    if(username){
      res.redirect('menulogged');
    }
    else{
      res.cookie("jwt",'',{expires : new Date(0)});
      res.render('index'); 
    }
  }
  else{
  res.render('index');}
});
app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/country', (req, res) => {
  res.render('country');
});
app.get('/register',(req,res) =>{
  res.render('register');
})
app.get('/addquestions', (req,res) =>{
  res.render('addquestions');
})
app.get('/disconnect',(req,res)=>{
  const jwt = req.cookies.jwt;
  if(jwt){

    res.cookie("jwt",'',{expires : new Date(0)});
    res.render('index'); 
  }
  else{
    res.render('index');
  }
})

app.get('/menulogged',(req,res) =>{
  const token = req.cookies.jwt;
  if(token){
    if(verifyToken(token)){
      res.render('menulogged');
    }
    else{
      res.cookie("jwt",'',{expires : new Date(0)});
      res.render('index');
    }}
  else{
  res.render('index');}
})



app.get('/login',(req,res)=>{
  const jwt = req.cookies.jwt;
  console.log(jwt);
  if(jwt){
    var username = verifyToken(jwt);
    console.log(username);
    if(username){
      res.redirect('menulogged');
    }
    else{
      res.cookie("jwt",'',{expires : new Date(0)});
      res.render('index'); 
    }
  }
  else{
  res.render('login');}
})

app.get('/loginadd',(req,res)=>{
  const jwt = req.cookies.jwt;
  console.log(jwt);
  if(jwt){
    var username = verifyToken(jwt);
    console.log(username);
    if(username){
      res.redirect('addquestions');
    }
    else{
      res.cookie("jwt",'',{expires : new Date(0)});
      res.render('loginadd'); 
    }
  }
  else{
  res.render('loginadd');}
})

app.post("/loginadd", (req,res)=>{
  const {username, password} = req.body;
  db.query('SELECT password FROM login WHERE username LIKE "' + username + '"', (err,results) =>{
    if (err) throw err;
    console.log(results);
    if(results[0] == undefined){
      res.render('login_failed');
    }
    else{
    const hash = results[0].password;
    const resp = bcrypt.compareSync(password,hash);
    console.log(resp);
    if(resp == true){
      const token = generateToken(username);
      res.cookie("jwt", token,{httpOnly : true, secure : true})
      console.log(jwt);
      res.render('addquestions');
    }
    else{
      res.render('login_failed');
    }
      }
    }
)});

app.post("/register", (req,res)=>{
  var {username, password, regions} = req.body;
  bcrypt.genSalt(saltRounds).then(salt =>{
    bcrypt.hash(password,salt).then(hash => {
      db.query('INSERT INTO login (username, password, region) VALUES (?, ?, ?)', [username, hash, regions], (err,results) => {
      if (err) throw err;
      res.render('index');
    })}
  )}
  )});

  
app.post("/question",(req,res)=>{
  const{question,answer,option1,option2,option3,regions} = req.body;
  
  console.log(regions);
  const jwt= req.cookies.jwt;
  if(jwt){
    var username = verifyToken(jwt);
    console.log(username);
    if(username){
      db.query('INSERT INTO RegionsQuiz(question,answer,option1,option2,option3,published_by,region) VALUES (?,?,?,?,?,?,?)',[question,answer,option1,option2,option3,username,regions], (err,results)=>{
        if (err) throw err;
        res.render('menulogged');
      })

    }
    else{
      res.cookie("jwt",'',{expires : new Date(0)});
      res.render('login'); }}
});


app.post("/login", (req,res)=>{
  const {username, password} = req.body;
  db.query('SELECT password FROM login WHERE username LIKE "' + username + '"', (err,results) =>{
    if (err) throw err;
    console.log(results);
    if(results[0] == undefined){
      res.render('login_failed');
    }
    else{
    const hash = results[0].password;
    const resp = bcrypt.compareSync(password,hash);
    console.log(resp);
    if(resp == true){
      const token = generateToken(username);
      res.cookie("jwt", token,{httpOnly : true, secure : true})
      console.log(jwt);
      res.render('menulogged',{username});
    }
    else{
      res.render('login_failed');
    }
      }
    }
)});




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