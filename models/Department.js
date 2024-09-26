const mongoose = require('mongoose')

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: false, // Có thể không có manager ngay từ đầu
  },
  description: {
    type: String,
  },
})

module.exports = mongoose.model('Department', DepartmentSchema)
