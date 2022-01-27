/*

Module Name: spadWebAppLogin

Decription: Used For Login Based On AWS Congnito User

Author: TTS, India

Last Updated Date: 09-20-2021

*/
const amazonCognitoIdentity = require("amazon-cognito-identity-js");
require("cross-fetch/polyfill");
const AWS = require("aws-sdk");
var util = require("util");
var mongoose = require("/opt/nodejs/config/mongo_db_connection");
var config = require("/opt/nodejs/config/config");
var mongodbConf = config.mongodb;
var userImpl = require("./userImpl.js");
var objUsers = new userImpl();
console.log('env',process.env.SCHEMA_NAME);
// Build the connection string
var dbURI = "mongodb://" + mongodbConf.host + ":" + mongodbConf.port + "/" + mongodbConf.schema;
var getUserByEmail = util.promisify(objUsers.getUserByEmail);
var updateUser = util.promisify(objUsers.updateUser);
var deleteUser = util.promisify(objUsers.deleteUser);
var getUserList = util.promisify(objUsers.getUserList);

exports.handler = async (event, context, callback) => {
  let response = {
    statusCode: 200,
    body: "",
  };
  let message = "";
  try {
    let cognitoInfo = "";
    let authRes = await authenticate(cognitoInfo, event["body-json"]);
    message = authRes;
  } catch (err) {
    response.statusCode = 401;
    message =
      "Invalid username or password, Please check user credentials and region";
  }
  response.body = message;
  console.log("response: ", response);
  callback(null, response);
};

/*** This Function Is Used For Authenticate User From AWS Cognito ***/
function authenticate(cognitoInfo, user) {
  return new Promise((resolve, reject) => {
    var cognitoUser;
    var authenticationData = {
      Username: user.userName,
      Password: user.password,
    };

    var authenticationDetails = new amazonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );

    var poolData = {
      UserPoolId: "UserPoolId",
      ClientId: "ClientId",
    };

    var userPool = new amazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
      Username: user.userName,
      Pool: userPool,
    };
    var handleAuthSuccesAndError = {
      onSuccess: function (result) {
        console.log("result:", result);
        var idToken = result.idToken.jwtToken;
        var userLogin = result.idToken.payload["custom:userRole"];
        var refreshToken = result.refreshToken.token;
        console.log("Token:", idToken);
        console.log("userLogin: ", userLogin);
        console.log("refreshToken--1--: ", refreshToken);
        var result = {
          token: idToken,
          email: result.idToken.payload.email,
          userRole: result.idToken.payload["custom:userRole"],
          refreshToken: refreshToken,
        };
        resolve(result); // return IdToken on successfull authentication
      },
      onFailure: function (err) {
        if (err.code == "NotAuthorizedException") {
          reject(err); // return with authorization error
        } else {
          reject("Internal Server Error"); // return server error in-case of unknown error
        }
      },
    };

    cognitoUser = new amazonCognitoIdentity.CognitoUser(userData);
    console.log("cognitoUser:", cognitoUser);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: handleAuthSuccesAndError.onSuccess,
      onFailure: handleAuthSuccesAndError.onFailure,
      newPasswordRequired: function (userAttributes) {
        delete userAttributes.email_verified;
        cognitoUser.completeNewPasswordChallenge(
          user.password,
          userAttributes,
          handleAuthSuccesAndError
        );
      },
    });
  });
}