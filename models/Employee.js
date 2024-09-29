const mongoose = require('mongoose')

const EmployeeSchema = new mongoose.Schema(
  {
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
    department: {
      type: String,
      ref: 'Department',
    },
    avatar: {
      type: String, // URL của ảnh đại diện
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active', // Trạng thái của nhân viên
    },
    leaveBalance: {
      type: Number,
      default: 2, // Số ngày phép còn lại
    },
    salary: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
) // Thêm timestamps

module.exports = mongoose.model('Employee', EmployeeSchema)
