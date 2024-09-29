const mongoose = require('mongoose')

const LeaveTypeSchema = new mongoose.Schema({
  leaveType: {
    type: String,
    required: true, // Tham chiếu đến nhân viên gửi yêu cầu nghỉ
  },
})

module.exports = mongoose.model('LeaveType', LeaveTypeSchema)
