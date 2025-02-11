const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../core/generateToken");
const validateMongodbId = require("../core/validateMongodbId");
const User = require("../models/User");
const { AppError } = require("../utils/AppErrors");
const passport = require('passport')
const { served, loginTokenName } = require('../core/config');
const { getUrlFromPath } = require("../utils/urlUtils");
const crypto = require('crypto');
const { sendTokenMail } = require("../utils/email/sendEmail");

require('./facebook-auth-strategy');
require('./google-auth-strategy');

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
// Google Auth Ctrls
// -------------------------------------
const googleAuthFailureCtrl = expressAsyncHandler(async ()=>{
  throw new AppError("Google Authentication Failed")
})

const parseSocial = expressAsyncHandler(async (req, res) => {
  const { provider, id } = req?.user
  const { email, given_name = '', family_name = '', email_verified } = req.user._json
  const userFound = await User.findOne({provider, providerId: id})
  res.user, req.session.user = null;
  if (userFound){
    res.cookie(loginTokenName, generateToken(userFound?._id), {
      maxAge: 1000 * 60 * 60 * 24 * 10,
      secure: served,
      path: "/",
      httpOnly: true,
    })
    .json({
      id: userFound?._id,
      email: userFound?.email,
    })

    console.log(userFound)
  } 
  else{
    try {
      const user = await new User({
        email,
        provider,
        providerId: id,
        firstName:given_name,
        lastName: family_name,
        verified: email_verified
      });
  
      await user.save();
  
      res.redirect(getUrlFromPath('/', 'base', true))
    } catch (error) {
      throw new AppError(error);
    }
  }
})

const googleAuthSuccessCtrl = expressAsyncHandler(async (req, res, next)=>{
  next(req?.user)
})

// -------------------------------------
// Facebook Auth Ctrls
// -------------------------------------
const facebookAuthFailureCtrl = expressAsyncHandler(async ()=>{
  throw new AppError("Facebook Authentication Failed")
})
const facebookAuthSuccessCtrl = expressAsyncHandler(async (req, res, next)=>{
  next(req.user)
})

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

// ------------------------------------------
// Generate verification token
// ------------------------------------------
const generateVerificationTokenCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  validateMongodbId(id);
  const userFound = await User.findById(id);
  if (!userFound) throw new AppError("User does not exist", 404);
  if (userFound.verified) throw new AppError('Account is already verified', 403) 

  try { 
    const token = await userFound.createAccountVerificationToken();
    await userFound.save();
    const send = await sendTokenMail(userFound.email, true, token);
    res.status(201).json("Email sent successfully");
  } catch (error) {
    throw new AppError(error)
  }
});

// ------------------------------------------
// Parsing verication token and account verification
// ------------------------------------------
const verifyAccountCtrl = expressAsyncHandler(async (req, res) => {
  const { token, user } = req?.query;

  if(!token || !user) throw new AppError('Invalid request', 403)
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const userFound = await User.findOne({
    _id: user,
    accountVerificationToken: hashedToken,
    accountVerificationTokenExpires: { $gt: new Date() },
  }).select('-password');

  if (!userFound) throw new Error("Token expired, try again later");

  try {
    userFound.verified = true;
    userFound.accountVerificationToken = undefined;
    userFound.accountVerificationTokenExpires = undefined;
    await userFound.save();

    res.json(userFound); 
  } catch (error) {
    throw new AppError(error)
  }
});

// ------------------------------------------
// Generate password token
// ------------------------------------------
const generatePasswordResetTokenCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  validateMongodbId(id);
  const userFound = await User.findById(id);
  if (!userFound) throw new AppError("User does not exist", 404);

  try { 
    const token = await userFound.createPasswordResetToken();
    await userFound.save();
    const send = await sendTokenMail(userFound.email, true, token);
    res.status(201).json("Email sent successfully");
  } catch (error) {
    throw new AppError(error)
  }
});

// ------------------------------------------
// Parsing password token and password reset
// ------------------------------------------
const resetPasswordCtrl = expressAsyncHandler(async (req, res) => {
  const { token, user, password } = req?.body;

  if(!token || !user) throw new AppError('Invalid request', 403)
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const userFound = await User.findOne({
    _id: user,
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: new Date() },
  }).select('-password');

  if (!userFound) throw new Error("Token expired, try again later");

  try {
    userFound.passwordResetToken = undefined;
    userFound.passwordResetTokenExpires = undefined;
    userFound.password = password
    await userFound.save();

    res.json(userFound); 
  } catch (error) {
    throw new AppError(error)
  }
});

// Fetch User
const fetchProfile = expressAsyncHandler(async (req, res) => {
  const user = req.user;

  try {
    const userCondensed = await User.findById(user.id)

    res.json({ ...userCondensed.toObject({ virtuals: true }) })
  } catch (error) {
    throw new AppError(error)
  }
})

// Update User
const updateProfile = expressAsyncHandler(async (req, res) => {
  const user = req.user;
  const { phone_number, date_of_birth, gender } = req.body

  try {
    const newUser = User.findByIdAndUpdate(user, {
      phone_number, date_of_birth, gender
    }, {
      new: true
    })

    res.json(newUser.toObject({ virtuals: true }))
  } catch (error) {
    throw new AppError(error)
  }
})

// Delete user
// ------------------------------------------
const deleteUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req?.user;

  try {
    const user = await User.findByIdAndDelete(id);
    res.json(user);
  } catch (error) {
    throw new AppError(error);
  }
});

const logoutUserCtrl = expressAsyncHandler(async (req, res) => {
  res.session.user = null
  res.clearCookie("login_token").json("successfully logged out");
});

module.exports = {
  register: userRegisterCtrl,
  login: userLoginCtrl,
  google_failure: googleAuthFailureCtrl,
  google_success: googleAuthSuccessCtrl,
  facebook_failure: facebookAuthFailureCtrl,
  facebook_success: facebookAuthSuccessCtrl,
  parseSocial,
  profile: fetchProfile,
  deleteUser: deleteUserCtrl,
  logout: logoutUserCtrl,
  generate_verify: generateVerificationTokenCtrl,
  verify: verifyAccountCtrl,
  generate_password_token: generatePasswordResetTokenCtrl,
  reset_password: resetPasswordCtrl
};
