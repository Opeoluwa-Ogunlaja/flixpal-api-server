const expressAsyncHandler = require("express-async-handler");
const { mongoose, isValidObjectId } = require("mongoose");
const User = require("../../models/user/User");

const isBannedMiddleware = expressAsyncHandler(async (req, res, next) => {
  const { id } = req?.params;
  const { email } = req?.body;
  let user;

  if (!req.user) {
    if (id && isValidObjectId(id)) {
      user = await User.findById(id);
    } else if (email) {
      user = await User.findOne({ email });
    } else {
      throw new Error("No User identifier found");
    }
  }
  else{
    user = req?.user
  }

  if (user && user?.isBanned) {
    throw new Error(
      `Account has been suspended. Contact our support team at support.${process.env.EMAIL}. This may be temporary`
    );
  }

  next();
});

module.exports = isBannedMiddleware;
