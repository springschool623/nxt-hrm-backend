const mongoose = require('mongoose')

const UserRoleSchema = new mongoose.Schema({
  userRoleType: {
    type: String,
    enum: ['Super Admin', 'Admin', 'HR', 'Employee'],
    required: true,
  },
  roleLevel: {
    type: Number,
    required: true,
  },
})

module.exports = mongoose.model('UserRole', UserRoleSchema)
