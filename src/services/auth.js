import bcrypt from "bcrypt";
import passport from "passport";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

//------------------------------- BCRYPT -------------------------------//
export const createHash = async (password) => {
  const salts = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salts);
};

export const validatePassword = async (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);

//------------------------------- JWT -------------------------------//
export const generateToken = (user, expiresIn = "6h") => {
  const token = jwt.sign(user, config.jwtSecret, { expiresIn });
  return token;
};

//------------------------------- PASSPORT -------------------------------//
export const passportCall = (strategy, options = {}) => {
  return async (req, res, next) => {
    passport.authenticate(
      strategy,
      { failureMessage: true },
      (error, user, info) => {
        if (error) return next(error);
        if (!options.strategyType) {
          console.log(`Route ${req.url} doesn't have definied strategyType`);
          return res.sendServerError("Internal server error");
        }
        if (!user) {
          switch (options.strategyType) {
            case "jwt":
              req.error = info.message ? info.message : info.toString();
              return next();

            case "locals":
              return res.sendUnauthorized(
                info.message ? info.message : info.toString()
              );
          }
        }
        req.user = user;
        next();
      }
    )(req, res, next);
  };
};

export const privacy = (privacyType) => {
  return (req, res, next) => {
    const user = req.user;
    switch (privacyType) {
      case "PRIVATE":
        if (user) next();
        else res.redirect("/login");
        break;

      case "NO_AUTHENTICATED":
        if (!user) next();
        else res.redirect("/products");
        break;
    }
  };
};
