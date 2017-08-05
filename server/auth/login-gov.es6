let passport = require('passport');
let SamlStrategy = require('passport-saml').Strategy;
let vcapServices = require('../vcap-services.es6');

let router = require('express').Router();

let loginGov = {};

loginGov.setup = () => {
  passport.use(
    new SamlStrategy(
      {
        cert: './login-gov-cert',
        entryPoint: vcapServices.loginGovEntryPoint,
        issuer: vcapServices.loginGovIssuer,
        path: '/auth/login-gov/saml/callback',
        privateKey: vcapServices.loginGovPrivateKey,
        signatureAlgorithm: 'sha256'
      },
      function(profile, done) {
        console.log('new saml strategy callback', profile, done);
      }
    )
  );
};

loginGov.router = router;

router.get('/login', passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }), (req, res) => {
  console.log('in the login auth handler', req.body);
  passport.authenticate('saml', {
    successRedirect: '/',
    failureRedirect: '/login'
  });
});

router.post('/callback', passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }), (req, res) => {
  console.log('in the login response handler', req.body);
  res.redirect('/');
});

router.get('/logout', (req, res) => {
  console.log('in the logout handler', req.body);
  req.logout();
  res.redirect('/');
});

module.exports = loginGov;
