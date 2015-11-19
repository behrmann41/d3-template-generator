require('dotenv').load();
var express = require('express');
var router = express.Router();
var pg = require('pg')
var conString = process.env.DATABASE_URL || 'postgres://@localhost/grafique'
var bcrypt = require('bcrypt');

/* GET users listing. */
router.post('/signup', function(req, res, next) {
  
  var errors = [];

  var hash = bcrypt.hashSync(req.body.signupForm.password, 10);

  if (!req.body.signupForm.email.trim()) {
    errors.push("Please enter a valid email")
  }

  if (!req.body.signupForm.password.trim()) {
    errors.push("Please enter a password")
  }

  if (req.body.signupForm.password.length < 8) {
    errors.push("Password needs to be at least 8 characters")
  }

  if (!req.body.email.match(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)){
    errors.push('Invalid Email')
  }

  if (req.body.signupForm.password !== req.body.signupForm.confirmPassword) {
    errors.push("Passwords do not match")
  }

  if (errors.length) {
    
  }

  pg.connect(conString, function(err, client, done) {




    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('INSERT INTO users(shell, taste) VALUES($1, $2) returning id',[req.body.shell, req.body.taste], function(err, result) {
      done();
      res.redirect('/tacos')
      if (err) {
        return console.error('error running query', err);
      }
      console.log("connected to database")
    });

  });

});

module.exports = router;
