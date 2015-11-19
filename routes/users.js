var express = require('express');
var router = express.Router();
var pg = require('pg')
var conString = 'postgres://@localhost/grafique'
var bcrypt = require('bcrypt');

/* GET users listing. */
router.post('/signup', function(req, res, next) {
  console.log(req.body)
  var hash = bcrypt.hashSync(req.body.user.password, 10)
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('INSERT INTO users(email, password) VALUES($1, $2) returning email',[req.body.user.email, hash], function(err, result) {
      done();
      req.session.user = req.body.user.email
      console.log(result, "RESULT")
      res.status(200).json(result)
      if (err) {
        return console.error('error running query', err);
      }
      console.log("connected to database")
    });
  });
});

module.exports = router;

// var errors = [];
//
// var hash = bcrypt.hashSync(req.body.signupForm.password, 10);
//
// if (!req.body.signupForm.email.trim()) {
//   errors.push("Please enter a valid email")
// }
//
// if (!req.body.signupForm.password.trim()) {
//   errors.push("Please enter a password")
// }
//
// if (req.body.signupForm.password.length < 8) {
//   errors.push("Password needs to be at least 8 characters")
// }
//
// if (!req.body.email.match(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)){
//   errors.push('Invalid Email')
// }
//
// if (req.body.signupForm.password !== req.body.signupForm.confirmPassword) {
//   errors.push("Passwords do not match")
// }
//
// if (errors.length) {
//
// }
