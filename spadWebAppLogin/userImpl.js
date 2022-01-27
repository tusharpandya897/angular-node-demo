var User = require("./user");

var userImpl = function () {};

module.exports = userImpl;


/***
    This method fetches a record from User collection based on emailId.
***/
userImpl.prototype.getUserByEmail = function (emailId, callback) {
  User.findOne(
    { email_id: emailId, is_deleted: false, is_active: true },
    function (findOneUserErr, findOneUserResult) {
      if (!findOneUserErr) {
        callback(null, findOneUserResult);
      } else {
        callback(findOneUserErr, null);
      }
    }
  );
};

/***
    This method inserts new record in User collection with the provided details.
***/
userImpl.prototype.updateUser = function (user, userId, updatedAt, callback) {
  User.updateOne(
    { email_id: user.email_id },
    {
      name: user.name,
      contact_name: user.name,
      contact_number: user.contact_number,
      secondary_email_id: user.email_id,
      secondary_contact_number: user.contact_number,
      address: user.address,
      role_id: user.role_id,
      description: user.description,
      updated_at: updatedAt,
      updated_by: userId,
    },
    function (createUserErr, createUserResult) {
      if (!createUserErr) {
        callback(null, createUserResult);
      } else {
        callback(createUserErr, null);
      }
    }
  );
};

/***** Delete User *****/
userImpl.prototype.deleteUser = function (user, userId, updatedAt, callback) {
  User.updateOne(
    { email_id: user.email_id },
    { is_deleted: true, updated_at: updatedAt, updated_by: userId },
    function (deleteOneUserErr, deleteOneUserResult) {
      if (!deleteOneUserErr) {
        callback(null, deleteOneUserResult);
      } else {
        callback(deleteOneUserErr, deleteOneUserResult);
      }
    }
  );
};

/***** Get Camera List *****/
userImpl.prototype.getUserList = function (callback) {
  User.find({}, function (getListUserErr, getUserListResult) {
    if (!getListUserErr) {
      callback(null, getUserListResult);
    } else {
      callback(getListUserErr, null);
    }
  });
};