const passport = require('passport')
const { served, FclientID, FclientSecret } = require("../core/config");
const { getUrlFromPath } = require("../utils/urlUtils");
const FacebookStrategy = require('passport-facebook').Strategy;

console.log(FclientID, FclientSecret)

passport.use(new FacebookStrategy({
    clientID: FclientID,
    clientSecret: FclientSecret,
    callbackURL: getUrlFromPath("facebook/callback", 'auth', true),
    enableProof: true
  },
  function(accessToken, refreshToken, profile, done) {
      return done(null, profile);
  }
));