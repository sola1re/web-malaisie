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

const secretKey = '123456789123456789123456789';
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
  res.redirect('menu');});
app.get('/menu', (req, res) => {
  console.log("test");
  const jwt = req.cookies.jwt;
  console.log(jwt);
  if(jwt){
    console.log(jwt);
    var username = verifyToken(jwt);
    if(username){
      res.redirect('menulogged');
    }
    else{
      res.cookie("jwt",'',{expires : new Date(0)});
      db.query('SELECT * FROM Questions INNER JOIN region on region.id = Questions.regionid ORDER BY RAND() LIMIT 2',(err,results)=>{
        const question1 = results[0];
        const options1 = shuffleArray([question1.answer, question1.option1, question1.option2, question1.option3]);
        const question2 = results[1];
        const options2 = shuffleArray([question2.answer, question2.option1, question2.option2, question2.option3]);
      res.render('menu', {question1, question2 , options1, options2});
    })
    }
  }
  else{
    db.query('SELECT * FROM Questions INNER JOIN region on region.id = Questions.regionid ORDER BY RAND() LIMIT 2',(err,results)=>{
      const question1 = results[0];
      const options1 = shuffleArray([question1.answer, question1.option1, question1.option2, question1.option3]);
      const question2 = results[1];
      const options2 = shuffleArray([question2.answer, question2.option1, question2.option2, question2.option3]);
    res.render('menu', {question1, question2 , options1, options2});
  })}
  
});
app.get('/about', (req, res) => {
  res.render('about');
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
    res.redirect('menu'); 
  }
  else{
    res.redirect('menu');
  }
})


                                              // AUTHENTIFICATION PART //

function generateToken(username) {
  const payload = { username };
  const options = { expiresIn: '1h' }; // Token expiration time
  return jwt.sign(payload, secretKey, options); 
}

function verifyToken(token) { try {
  const decoded = jwt.verify(token, secretKey);
  return decoded.username; } catch (err) {
  return null; // Token is invalid or expired }
  }
}


app.get('/login',(req,res)=>{
  const jwt = req.cookies.jwt;
  if(jwt){
    var username = verifyToken(jwt);
    if(username){
      res.redirect('menulogged');
    }
    else{
      res.cookie("jwt",'',{expires : new Date(0)});
      res.render('login'); 
    }
  }
  else{
  res.render('login');}
})

app.get('/loginacc',(req,res)=>{
  const jwt = req.cookies.jwt;
  if(jwt){
    var username = verifyToken(jwt);
    if(username){
      db.query('SELECT * FROM Questions INNER JOIN login on Questions.user_id = login.username WHERE user_id LIKE "' + username + '"',(err,results)=>{
        if(err) throw err;
        
        res.render('account',{questions :results});
    })
    }
    else{
      res.cookie("jwt",'',{expires : new Date(0)});
      res.render('loginacc'); 
    }
  }
  else{
  res.render('loginacc');}
})

app.get('/loginadd',(req,res)=>{
  const jwt = req.cookies.jwt;
  if(jwt){
    var username = verifyToken(jwt);
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

app.get('/logincountry',(req,res)=>{
  const jwt = req.cookies.jwt;
  if(jwt){
    var username = verifyToken(jwt);
    if(username){
      res.redirect('country');
    }
    else{
      res.cookie("jwt",'',{expires : new Date(0)});
      res.render('logincountry'); 
    }
  }
  else{
  res.render('logincountry');}
})

app.post("/logincountry", (req,res)=>{
  const {username, password} = req.body;
  db.query('SELECT password FROM login WHERE username LIKE "' + username + '"', (err,results) =>{
    if (err) throw err;
    if(results[0] == undefined){
      res.render('login_failed');
    }
    else{
    const hash = results[0].password;
    const resp = bcrypt.compareSync(password,hash);
    if(resp == true){
      const token = generateToken(username);
      res.cookie("jwt", token,{httpOnly : true, secure : true})
      res.render('country');
    }
    else{
      res.render('login_failed');
    }
      }
    }
)});


app.post("/loginadd", (req,res)=>{
  const {username, password} = req.body;
  db.query('SELECT password FROM login WHERE username LIKE "' + username + '"', (err,results) =>{
    if (err) throw err;
    if(results[0] == undefined){
      res.render('login_failed');
    }
    else{
    const hash = results[0].password;
    const resp = bcrypt.compareSync(password,hash);
    if(resp == true){
      const token = generateToken(username);
      res.cookie("jwt", token,{httpOnly : true, secure : true})
      res.render('addquestions');
    }
    else{
      res.render('login_failed');
    }
      }
    }
)});

app.post("/loginacc", (req,res)=>{
  const {username, password} = req.body;
  db.query('SELECT password FROM login WHERE username LIKE "' + username + '"', (err,results) =>{
    if (err) throw err;
    if(results[0] == undefined){
      res.render('login_failed');
    }
    else{
    const hash = results[0].password;
    const resp = bcrypt.compareSync(password,hash);
    if(resp == true){
      const token = generateToken(username);
      res.cookie("jwt", token,{httpOnly : true, secure : true})
  
        
        res.redirect('account');
    }
    else{
      res.render('login_failed');
    }
      }
    }
)});

app.post("/register", (req, res) => {
  const { username, password, regions } = req.body;
  
  db.beginTransaction(err => {
    if (err) {
      return res.status(500).send('Server error');
    }

    bcrypt.genSalt(saltRounds).then(salt => {
      bcrypt.hash(password, salt).then(hash => {
        db.query('INSERT INTO login (username, password, idregion) VALUES (?, ?, ?)', [username, hash, regions], (err, results) => {
          if (err) {
            return db.rollback(() => {
              return res.status(500).send('Error creating user');
            });
          }
          
          const regionsToInsert = [1, 2, 3, 4, 5, 6]; 
          let state = 0;
          regionsToInsert.map(regionId => 
            db.query('INSERT INTO score (idregion, username) VALUES (?, ?)', [regionId, username], (err, results) => {
              if (err) {
                return db.rollback(() => {
                  return res.status(500).send('Error initializing score');
                });
              }
              state ++;
              if (state == 6){
                db.commit(err => {
                  if (err) {
                    return db.rollback(() => {
                      return res.status(500).send('Error committing transaction');
                    });
                  }
                  res.redirect('login');
                });
              }
            })
          );
        });
      });
    });
  });
});



  app.post("/login", (req,res)=>{
    const {username, password} = req.body;
    db.query('SELECT password FROM login WHERE username LIKE "' + username + '"', (err,results) =>{
      if (err) throw err;
      if(results[0] == undefined){
        res.render('login_failed');
      }
      else{
      const hash = results[0].password;
      const resp = bcrypt.compareSync(password,hash);
      if(resp == true){
        const token = generateToken(username);
        res.cookie('jwt', token,{httpOnly : true, secure : true})
        res.redirect('menulogged');
      }
      else{
        res.render('login_failed');
      }
        }
      }
  )});





app.get('/menulogged',(req,res) =>{
  const token = req.cookies.jwt;
  if(token){
    if(verifyToken(token)){
      db.query('SELECT * FROM Questions INNER JOIN region on region.id = Questions.regionid ORDER BY RAND() LIMIT 2',(err,results)=>{
        const question1 = results[0];
        const options1 = shuffleArray([question1.answer, question1.option1, question1.option2, question1.option3]);
        const question2 = results[1];
        const options2 = shuffleArray([question2.answer, question2.option1, question2.option2, question2.option3]);
      res.render('menulogged', {question1, question2 , options1, options2});
    })}
    else{
      res.cookie("jwt",'',{expires : new Date(0)});
      res.redirect('menu');
    }}
  else{
  res.redirect('menu');}
})

app.post('/modify', function(req,res){

  const{questionId,question,answer,option1,option2,option3,regions} = req.body;
  const jwt= req.cookies.jwt;
  if(jwt){
    var username = verifyToken(jwt);
    if(username){
      db.query('UPDATE Questions SET question = ?, answer = ?, option1 = ?, option2 = ?, option3 = ?, regionid = ?  WHERE id = ?',[question,answer,option1,option2,option3,regions,questionId], (err,results)=>{
      if(err) throw err;
      res.redirect('account');
      })}
    else{
      res.cookie("jwt",'',{expires : new Date(0)});
      res.render('loginacc');
    }}
  else{
      res.redirect('loginacc');
    }
    
  })

app.get('/account', (req, res) => {
  const jwt = req.cookies.jwt;
  if(jwt){
    var username = verifyToken(jwt);
    if(username){
      var username = verifyToken(jwt);
      db.query('SELECT Questions.id, Questions.question, Questions.answer, region.region, Questions.regionid, Questions.option1, Questions.option2, Questions.option3 FROM Questions INNER JOIN login on Questions.user_id = login.username INNER JOIN region on region.id = Questions.regionid WHERE user_id LIKE "' + username + '"',(err,results)=>{
        if (err) {
          return db.rollback(() => {
            return res.status(500).send('Error creating user');
          });
        }
        const regions = [1,2,3,4,5,6];

        db.query('SELECT score.score, score.attempt, region.region FROM score INNER JOIN region on region.id = score.idregion WHERE username LIKE "' + username + '"',(err,results2)=>{
          if (err) {
            return db.rollback(() => {
              return res.status(500).send('Error creating user');
            });
          }
          db.query('SELECT login.permission FROM login WHERE username LIKE "' + username + '"',(err,results3)=>{
            if(err){
              return db.rollback(() => {
                return res.status(500).send('Error creating user');
              });
            }
            if (results3[0].permission == "Admin")
              {
                db.query('SELECT Questions.id, Questions.question, Questions.answer, region.region, Questions.regionid, Questions.option1, Questions.option2, Questions.option3, Questions.user_id FROM Questions INNER JOIN login on Questions.user_id = login.username INNER JOIN region on region.id = Questions.regionid WHERE user_id NOT LIKE "' + username + '"',(err,results4)=>{
                  if (err) {
                    return db.rollback(() => {
                      return res.status(500).send('Error creating user');
                    });
                  }
                  res.render('account',{questions :results, regions : regions, scores : results2, admin : true, questions2 : results4});
                })
              }
            else{
              res.render('account',{questions :results, regions : regions, scores : results2, admin : false});}
        })
    })
    })}
    else{
      res.cookie("jwt",'',{expires : new Date(0)});
      res.redirect('loginacc'); 
    }
  }
  else{
  res.redirect('loginacc');}
});


  
app.post("/question",(req,res)=>{
  const{question,answer,option1,option2,option3,regions} = req.body;
  const jwt= req.cookies.jwt;
  if(jwt){
    var username = verifyToken(jwt);
    if(username){
      db.query('INSERT INTO Questions(question,answer,option1,option2,option3,regionid,user_id) VALUES (?,?,?,?,?,?,?)',[question,answer,option1,option2,option3,regions,username], (err,results)=>{
        if (err) throw err;
        res.redirect('menulogged');
      })

    }
    else{
      res.cookie("jwt",'',{expires : new Date(0)});
      res.render('login'); }}
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // échange des éléments
  }
  return array;
}


app.get('/country/:region', (req, res) => {
  const region = req.params.region;
  console.log('Requested region:', region);
  const query = "SELECT Questions.id, Questions.question, Questions.answer, Questions.option1, Questions.option2, Questions.option3, Questions.regionid, Questions.user_id, region.region FROM Questions INNER JOIN region on region.id = Questions.regionid WHERE region = ? ORDER BY RAND() LIMIT 1";

  db.query(query, [region], (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).send('Error fetching quiz questions.');
    }
    const question = results[0];
    const options = shuffleArray([question.answer, question.option1, question.option2, question.option3]);
    console.log('Query results:', results);
    console.log('id : ', question.id);

    res.render('country', { user_id : question.user_id, regionid : question.regionid, id : question.id,question: question.question,options, region: region, bool : true });
  });
  
});

app.get('/country', (req, res) => {
  const jwt = req.cookies.jwt;
  if(jwt){
    console.log(jwt);
    var username = verifyToken(jwt);
    if(username){
      console.log(username);
      res.render('country');}
    else{
      console.log('1 else jwt')
      res.cookie("jwt",'',{expires : new Date(0)});
      res.render('logincountry'); }
      }
  else{
    console.log('2 else no jwt')
    res.render('logincountry');
  }
});



app.post('/check-answer', (req, res) => {
  const questionId = req.body.questionId;
  const userAnswer = req.body.answer;
  const jwt = req.cookies.jwt;
  var username = verifyToken(jwt);
  const query = 'SELECT answer FROM Questions WHERE id = ?';

  db.query(query, [questionId], (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).send('Error checking answer.');
    }
    const correctAnswer = results[0].answer;

    if (userAnswer === correctAnswer) {
      db.query('UPDATE score SET score = score + 1, attempt = attempt + 1 WHERE idregion = ? AND username = ? ', [req.body.regionid, username], (err,results)=>{
      res.render('country', ({ bool : true},{output:{correct :true, message : "Correct !"}}));
    })}
    else{
      db.query('UPDATE score SET attempt = attempt + 1 WHERE idregion = ? AND username = ?', [req.body.regionid, username], (err,results)=>{
      res.render('country', ({correctAnswer : correctAnswer},{ bool : true},{output:{correct :false, message : "Incorrect !\n The correct answer was : "  + correctAnswer + "\n"}}));
    })
    };
});
});

app.delete('/delete-question/:id', function(req, res) {
  const questionId = req.params.id;
  db.query('DELETE FROM Questions WHERE id = ?', [questionId], (err,results)=>{
    if(err) throw err;
  })
  res.json({ message: 'Question supprimée avec succès' });
});

app.delete('/delete-user/:username', function(req, res) {
  const username = req.params.username;
  db.query('DELETE FROM Questions WHERE user_id = ?', [username], (err,results)=>{
    if(err) throw err;
    db.query('DELETE FROM score WHERE username = ?', [username], (err,results)=>{
    if(err) throw err;
    db.query('DELETE FROM login WHERE username = ?', [username], (err,results)=>{
      if(err) throw err;
    })
  })
  res.json({ message: 'Utilisateur supprimé avec succès' });
})
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