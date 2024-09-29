const mongoose = require('mongoose')

const LeaveRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true,
    unique: true, // Đảm bảo mỗi yêu cầu nghỉ có một ID duy nhất
  },
  employeeId: {
    type: String,
    required: true, // Tham chiếu đến nhân viên gửi yêu cầu nghỉ
  },
  leaveType: {
    type: String,
    required: true, // Tham chiếu đến nhân viên gửi yêu cầu nghỉ
    ref: 'LeaveType',
  },
  startDate: {
    type: Date,
    required: true, // Ngày bắt đầu nghỉ
  },
  endDate: {
    type: Date,
    required: true, // Ngày kết thúc nghỉ
  },
  reason: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'], // Trạng thái của yêu cầu nghỉ
    default: 'pending',
  },
  approverId: {
    type: String, // ID của người phê duyệt (nếu có)
  },
  submittedDate: {
    type: Date,
    required: true, // Ngày nộp yêu cầu
    default: Date.now, // Gán mặc định là ngày hiện tại
  },
})

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema)
