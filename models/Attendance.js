const mongoose = require('mongoose')

const AttendanceSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  date: { type: Date, required: true }, // Ngày chấm công
  checkIn: { type: Date, required: true }, // Thời gian vào
  checkOut: { type: Date, required: true }, // Thời gian ra
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late', 'Early Leave'],
    default: 'Present',
  }, // Trạng thái chấm công
  remarks: { type: String }, // Ghi chú nếu có (VD: lý do nghỉ, đến muộn)
})

module.exports = mongoose.model('Attendance', AttendanceSchema)
