const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../core/generateToken");
const validateMongodbId = require("../core/validateMongodbId");
const User = require("../models/User");
const { AppError } = require("../utils/AppErrors");
const { served, GclientID, GclientSecret } = require("../core/config");
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy;


passport.use(new GoogleStrategy({
  clientID: GclientID,
  clientSecret: GclientSecret,
  callbackURL: "http://localhost:3000/google/callback",
  passReqToCallback: true
},
  function (request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

//-------------------------------------
// Register
//-------------------------------------
const userRegisterCtrl = expressAsyncHandler(async (req, res) => {
  const { email, password } = req?.body;
  const emailExists = await User.findOne({ email });

  if (emailExists)
    throw new AppError("User with this email already exists", 400);

  try {
    const user = await new User({
      email,
      password,
    });

    await user.save();

    res.status(201).json({
      id: user?._id,
      email: user?.email,
    });

  } catch (error) {
    throw new AppError(error);
  }
});

// -------------------------------------
// Login
// -------------------------------------
const userLoginCtrl = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const userFound = await User.findOne({ email });

  if (!userFound || !(await userFound.isPasswordMatched(password))) throw new AppError("Who you be??", 400);

  try {
    res.cookie("login_token", generateToken(userFound?._id), {
      maxAge: 1000 * 60 * 60 * 24 * 10,
      secure: served,
      path: "/",
      httpOnly: true,
    });

    res.status(200).json({
      id: userFound?._id,
      email: userFound?.email,
    });
  } catch (error) {
    throw new AppError(error);
  }
});

// // Fetch User
// const fetchProfile = expressAsyncHandler(async (req, res) => {
//   const user = req.user;

//   try {
//     const userCondensed = await User.findById(user.id, { words: { $slice: [0, 8]}}).populate({ path: 'words', sort: '-updatedAt' }).exec()

//     res.json({...userCondensed.toObject({ virtuals: true }), wordsToday: await userCondensed.wordsToday})
//   } catch (error) {
//     throw new AppError(error)
//   }
// })

// // Fetxh User friend 
// const fetchFriend = expressAsyncHandler(async (req, res) => {

//   try {
//     const friend = await User.findById(req.user.friend).select('username lastLogin')
//     if (!friend) throw new AppError('An Error occured');

//     res.json(friend)
//   } catch (error) {
//     throw new AppError(error)
//   }
// })

// // Delete user
// // ------------------------------------------
// const deleteUserCtrl = expressAsyncHandler(async (req, res) => {
//   const { id } = req?.user;

//   try {
//     const user = await User.findByIdAndDelete(id);
//     res.json(user);
//   } catch (error) {
//     throw new AppError(error);
//   }
// });

// const logoutUserCtrl = expressAsyncHandler(async (req, res) => {
//   res.clearCookie("SIT").json("successfully logged out");
// });

module.exports = {
  register: userRegisterCtrl,
  login: userLoginCtrl,
  // profile: fetchProfile,
  // friend: fetchFriend,
  // deleteUser: deleteUserCtrl,
  // logout: logoutUserCtrl
};
