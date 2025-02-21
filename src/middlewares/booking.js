const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/app-error");

const { CognitoJwtVerifier } = require("aws-jwt-verify");

const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const CLIENT_ID = process.env.COGNITO_CLIENT_ID;

const verifier = CognitoJwtVerifier.create({
  userPoolId: USER_POOL_ID,
  tokenUse: "id",
  clientId: CLIENT_ID,
});

const checkLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new AppError(
        "the user is not logged in ",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
    console.log(token);
    const payload = await jwt.decode(token);

    if (!payload) {
      throw new AppError(
        "Invalid token format",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    req.user = payload;

    next();
  } catch (err) {
    console.error(" Token Verification Failed:", err);
    ErrorResponse.error = err.explanation || "Token Verification Failed";
    return res.status(err.statusCode, ErrorResponse);
  }
};

module.exports = {
  checkLoggedIn,
};
