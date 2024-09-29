const mongoose = require('mongoose')

const DepartmentSchema = new mongoose.Schema(
  {
    departmentName: {
      type: String,
      required: true,
    },
    manager: {
      type: String,
      ref: 'Employee',
      required: false, // Có thể không có manager ngay từ đầu
    },
    totalEmployee: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Department', DepartmentSchema)
