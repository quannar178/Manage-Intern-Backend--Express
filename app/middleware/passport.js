const { PRIVATE_KEY } = require("../configs/env");
const { ExtractJwt } = require("passport-jwt");
const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const PassportLocal = require("passport-local").Strategy;
const db = require("../configs/db.configs");
const User = db.User;

const checkExpiredToken = (exp) => {
  const timeUTC = new Date().getTime() + 1;
  return timeUTC < exp;
};

//JWT
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"),
      secretOrKey: PRIVATE_KEY,
    },
    async (payload, done) => {
      try {
        console.log("payload", payload);
        const user = await User.findOne({ where: { id: payload.sub } });
        // console.log(user);
        if (!user) {
          done(null, false);
        }
        const isValidExp = checkExpiredToken(payload.exp);
        if (!isValidExp) {
          done(null, false);
        }
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

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
        console.log(user);
        done(null, user);
      } catch (error) {
        console.log("error");
        done(error, false);
      }
    }
  )
);
