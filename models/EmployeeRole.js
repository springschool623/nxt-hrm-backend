const mongoose = require('mongoose')

const EmployeeRoleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    ref: 'Department',
    required: true,
  },
})

module.exports = mongoose.model('EmployeeRole', EmployeeRoleSchema)
