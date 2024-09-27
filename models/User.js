const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userRoleType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserRole',
      default: 'Employee',
    },
  },
  { timestamps: true }
) // This option adds createdAt and updatedAt fields

module.exports = mongoose.model('User', UserSchema)
