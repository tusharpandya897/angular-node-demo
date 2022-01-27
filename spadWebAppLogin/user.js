var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: { type: String, required: true },
  //code: { type: String },
  email_id: { type: String, required: true, unique: true },
  driving_license: { type: String, required: true },
  address: { type: String },
  contact_name: { type: String, required: true },
  contact_number: { type: String, required: true },
  secondary_email_id: { type: String },
  secondary_contact_number: { type: String },
  role_id: { type: Schema.Types.ObjectId, ref: "UserRole", required: true },
  description: { type: String },
  created_at: { type: Date },
  created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  updated_at: { type: Date },
  updated_by: { type: Schema.Types.ObjectId, ref: "User" },
  is_active: { type: Boolean, default: true },
  is_deleted: { type: Boolean, default: false },
});

var User = mongoose.model("User", userSchema);

module.exports = User;
