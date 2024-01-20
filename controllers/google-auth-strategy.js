const { served, GclientID, GclientSecret } = require("../core/config");
const passport = require('passport');
const { getUrlFromPath } = require("../utils/urlUtils");
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
  clientID: GclientID,
  clientSecret: GclientSecret,
  callbackURL: getUrlFromPath("google/callback", 'auth', true),
  passReqToCallback: true
},
  function (request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));