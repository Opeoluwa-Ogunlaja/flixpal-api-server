const expressAsyncHandler = require("express-async-handler");
const { isValidObjectId } = require("mongoose");
const User = require("../../models/user/User");

const mustVerifiedMiddleware = expressAsyncHandler(async (req, res, next) => {
  const { id } = req?.params;
  const { email, username, user: customUser } = req?.body;
  let user;

  if (!req.user) {
    if (id && isValidObjectId(id)) {
      user = await User.findById(id);
    } else if (email) {
      user = await User.findOne({ email });
    }
    else if (username) {
      user = await User.findOne({ username });
    }
    else if(customUser){
      user = await User.findOne({ username: customUser })
      if (user == null) {
        user = await User.findOne({ email: customUser })
      }
    }
    console.log(user, customUser, email, username)
  }
  else{
    user = req?.user
  }

  if (user && !user?.isAccountVerified) {
    throw new Error(
      `Account is not verified. Check your email inbox or spam folder for verification link to verify account`
    );
  }

  next();
});

module.exports = mustVerifiedMiddleware;
