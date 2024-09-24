const mongoose = require('mongoose')

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Employee', EmployeeSchema)
