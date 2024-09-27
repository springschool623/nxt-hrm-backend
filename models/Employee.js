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
    avatar: {
      type: String, // URL của ảnh đại diện
    },
    manager: {
      type: String,
      required: false, // Tham chiếu tới manager nếu có
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active', // Trạng thái của nhân viên
    },
    leaveBalance: {
      type: Number,
      default: 0, // Số ngày phép còn lại
    },
  },
  { timestamps: true }
) // Thêm timestamps

module.exports = mongoose.model('Employee', EmployeeSchema)
