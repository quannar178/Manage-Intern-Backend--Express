// const { PRIVATE_KEY } = require("../config/env");
// const { ExtractJwt } = require("passport-jwt");
const passport = require("passport");
// const JWTStrategy = require("passport-jwt").Strategy;
const PassportLocal = require("passport-local").Strategy;
const db = require("../configs/db.configs");
const User = db.User;

//Local
passport.use(
  new PassportLocal(
    { usernameField: "email" },
    async (email, password, done) => {
      console.log("in passport @@@@@@@@@@@@@@@@@22");
      console.log(email, password);
      try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
          done(null, false);
        }
        const isCorrectPassword = await user.isValidPassword(password);

        if (!isCorrectPassword) {
          done(null, false);
        }
        done(null, user.uuiduser);
      } catch (error) {
          console.log("error");
        done(error, false);
      }
    }
  )
);
