const express = require('express');
const passport = require('passport');
const bcyrpt = require('bcrypt');
const Users = require('../passport/user.js')

const router = express.Router();
const bcryptSettings = {
  saltRounds: 10
};

router.post('/signin', passport.authenticate('local', {
  successRedirect: '/status',
  failureRedirect: '/status'
}));

router.get('/signout', (req, res) => {
  req.logout();
  res.json({'status': true});
});

router.post('/signup', (req, res) => {
  bcyrpt.hash(req.body['pw'], bcryptSettings.saltRounds, (err, hash) => {
    Users.signUp(req.body['id'], hash);
  });
  res.json({'status': true});
});

router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({'status': true, 'id': req.user['id']});
  }
  else {
    res.json({'status': false, 'message': 'Authenticated failed'});
  }
});

router.get('/assets', (req, res) => {
  if (req.isAuthenticated()) {
    Users.getAssets(req.user['id']).then((results) => {
      res.json({'status': true, 'assets': results});
    });
  }
  else {
    res.json({'status': false, 'message': 'Authenticated failed'});
  }
});

router.post('/assets', (req, res) => {
  if (req.isAuthenticated()) {
    Users.addAsset(req.user['id'], req.body['type'], req.body['title'], req.body['money']);
    res.json({'status': true});
  }
  else {
    res.json({'status': false, 'message': 'Authenticated failed'});
  }
});

router.post('/assets/delete', (req, res) => {
  Users.deleteAsset(req.user['id'], req.body['title']);
  res.json({'status': true});
});

module.exports = router;
