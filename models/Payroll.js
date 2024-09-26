const mongoose = require('mongoose')

const PayrollSchema = new mongoose.Schema({
  payrollId: {
    type: String,
    required: true,
    unique: true, // Đảm bảo mỗi bản ghi lương có một ID duy nhất
  },
  employeeId: {
    type: String,
    required: true, // Tham chiếu tới nhân viên
  },
  month: {
    type: String,
    required: true, // Tháng tính lương (VD: '2023-09')
  },
  baseSalary: {
    type: Number,
    required: true, // Lương cơ bản
  },
  overtimeHours: {
    type: Number,
    required: true, // Giờ làm thêm
    default: 0, // Mặc định là 0 nếu không có giờ làm thêm
  },
  deductions: {
    type: Number,
    required: true, // Các khoản khấu trừ
    default: 0, // Mặc định là 0 nếu không có khoản khấu trừ
  },
  netSalary: {
    type: Number,
    required: true, // Lương thực nhận sau khấu trừ
  },
  paidOn: {
    type: Date, // Ngày thanh toán lương
    required: true,
    default: Date.now, // Mặc định là ngày hiện tại
  },
})

module.exports = mongoose.model('Payroll', PayrollSchema)
