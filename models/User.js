const mongoose = require("mongoose");

const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Email is required"],
    },

    password: {
      type: String,
    },

    firstName: String,
    lastName: String,

    provider: String,
    providerId: String, 
    verified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: {
      createdAt: "dateAdded",
      updatedAt: "lastUpdateTime",
    },
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

//--------------------------------------------
//  Model Middlewares
//--------------------------------------------
// Password Hashing Middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);


module.exports = User
