var router = require('express').Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var User = require('../models/user');

router.post('/', function (req, res){
  User.findOne({
    username: req.body.user.username,
    password_digest: bcrypt.hashSync(req.body.user.password)
  }).then(function(user) {
    if (user) {
      user.authenticate(req.user.body.password, function(isMatch) {
        if (isMatch) {
          res.json({
            message: 'Welcome back!',
            user: user,
            auth_token: jwt.sign(userData._id, process.env.JWT_SECRET, {
              expiresIn: 60*60*24
            })
          })
        }
        else {
          // passwords don't match
          res.json({
            message: 'We were unable to log you in with those credentials.'
          })
        }
      });
    }
    else {
      // username not found
      res.json({
        message: 'We were unable to log you in with those credentials.'
      })
    }
  });
});

module.exports = router;
