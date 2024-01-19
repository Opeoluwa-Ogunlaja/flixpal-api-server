const MongoStore = require("connect-mongo");
const { mongoUrl, jwtSecret } = require("./config");
const { MongoClient } = require("mongodb");
const cookieParser = require("cookie-parser");

const client = new MongoClient(mongoUrl);

const mongoStore = new MongoStore({ client });

const getSession = async (sessionId) => {
  const sessionIdParsed = cookieParser.signedCookie(sessionId, jwtSecret);

  var session = null;

  const setSession = function (
    err,
    retrievedSession
  ) {
    if (err) return;

    session = retrievedSession;
  };

  mongoStore.get(sessionIdParsed, setImmediate(setSession))

  return session;
};

module.exports = { mongoStore, getSession };
