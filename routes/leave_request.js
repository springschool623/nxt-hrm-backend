const express = require('express')
const LeaveRequest = require('../models/LeaveRequest') // Đường dẫn tới mô hình LeaveRequest
const Employee = require('../models/Employee') // Đường dẫn tới model Employee
const router = express.Router()

// Hàm tạo ID yêu cầu (bạn có thể tùy chỉnh theo nhu cầu)
const generateRequestId = () => {
  return 'REQ-' + Date.now() // ID đơn giản, có thể cải thiện thêm
}

// API để lấy danh sách các đơn xin nghỉ
router.get('/all-request-list', async (req, res) => {
  try {
    // Lấy tất cả các đơn xin nghỉ từ cơ sở dữ liệu
    const leaveRequests = await LeaveRequest.find()

    // Lặp qua từng người dùng để tìm thông tin Employee tương ứng
    const leaveRequestsWithEmployeeInfo = await Promise.all(
      leaveRequests.map(async (leaveRequest) => {
        const employee = await Employee.findOne({
          employeeId: leaveRequest.employeeId,
          status: { $ne: 'inactive' },
        })
        if (employee) {
          return {
            ...leaveRequest.toObject(), // Chuyển đổi User sang Object
            employeeInfo: {
              avatar: employee.avatar,
              name: employee.name,
            },
          }
        } else {
          return {
            ...leaveRequest.toObject(),
            employeeInfo: null, // Nếu không tìm thấy Employee thì đặt là null
          }
        }
      })
    )

    return res.status(200).json(leaveRequestsWithEmployeeInfo) // Trả về danh sách các đơn xin nghỉ
  } catch (error) {
    return res.status(500).json({ message: 'Có lỗi xảy ra.', error })
  }
})

// API để lấy danh sách tất cả nhân viên ( lấy những nhân viên có status là 'pending' )
router.get('/pending-request-list', async (req, res) => {
  try {
    // Tìm tất cả nhân viên có status khác 'pending'
    const leaveRequests = await LeaveRequest.find({
      status: 'pending',
    })

    // Lặp qua từng người dùng để tìm thông tin Employee tương ứng
    const leaveRequestsWithEmployeeInfo = await Promise.all(
      leaveRequests.map(async (leaveRequest) => {
        const employee = await Employee.findOne({
          employeeId: leaveRequest.employeeId,
          status: { $ne: 'inactive' },
        })
        if (employee) {
          return {
            ...leaveRequest.toObject(), // Chuyển đổi User sang Object
            employeeInfo: {
              avatar: employee.avatar,
              name: employee.name,
            },
          }
        } else {
          return {
            ...leaveRequest.toObject(),
            employeeInfo: null, // Nếu không tìm thấy Employee thì đặt là null
          }
        }
      })
    )
    res.status(200).json(leaveRequestsWithEmployeeInfo)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to retrieve leave requests', error })
  }
})

// API để lấy danh sách tất cả nhân viên ( lấy những nhân viên có status là 'approved' )
router.get('/approve-request-list', async (req, res) => {
  try {
    // Tìm tất cả nhân viên có status khác 'approved'
    const leaveRequests = await LeaveRequest.find({
      status: 'approved',
    })
    res.status(200).json(leaveRequests)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to retrieve leave requests', error })
  }
})

// API để lấy danh sách tất cả nhân viên ( lấy những nhân viên có status là 'rejected' )
router.get('/reject-request-list', async (req, res) => {
  try {
    // Tìm tất cả nhân viên có status khác 'rejected'
    const leaveRequests = await LeaveRequest.find({
      status: 'rejected',
    })
    res.status(200).json(leaveRequests)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to retrieve leave requests', error })
  }
})

// API để thêm đơn xin nghỉ
router.post('/add', async (req, res) => {
  const { employeeId, leaveType, startDate, endDate, reason } = req.body

  // Kiểm tra xem tất cả các thông tin cần thiết đã được cung cấp
  if (!employeeId || !leaveType || !startDate || !endDate || !reason) {
    return res.status(400).json({ message: 'Missing information!' })
  }

  // Tạo một yêu cầu nghỉ mới
  const leaveRequest = new LeaveRequest({
    requestId: generateRequestId(), // Hàm tạo ID duy nhất cho yêu cầu
    employeeId,
    leaveType,
    startDate,
    endDate,
    reason,
    status: 'pending', // Mặc định trạng thái là 'pending'
  })

  try {
    // Lưu yêu cầu nghỉ vào cơ sở dữ liệu
    const savedRequest = await leaveRequest.save()
    return res.status(201).json(savedRequest) // Trả về yêu cầu đã lưu
  } catch (error) {
    return res.status(500).json({ message: 'Có lỗi xảy ra.', error })
  }
})

// API để cập nhật trạng thái đơn xin nghỉ thành "approved"
router.put('/approve/:requestId', async (req, res) => {
  const { requestId } = req.params

  try {
    // Tìm đơn xin nghỉ bằng requestId
    const leaveRequest = await LeaveRequest.findOne({ requestId })

    // Kiểm tra xem đơn xin nghỉ có tồn tại hay không
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Không tìm thấy đơn xin nghỉ.' })
    }

    // Cập nhật trạng thái thành "approved"
    leaveRequest.status = 'approved'

    // Lưu thay đổi vào cơ sở dữ liệu
    const updatedLeaveRequest = await leaveRequest.save()

    return res.status(200).json(updatedLeaveRequest) // Trả về đơn xin nghỉ đã được cập nhật
  } catch (error) {
    return res.status(500).json({ message: 'Có lỗi xảy ra.', error })
  }
})

// API để cập nhật trạng thái đơn xin nghỉ thành "rejected"
router.put('/rejected/:requestId', async (req, res) => {
  const { requestId } = req.params

  try {
    // Tìm đơn xin nghỉ bằng requestId
    const leaveRequest = await LeaveRequest.findOne({ requestId })

    // Kiểm tra xem đơn xin nghỉ có tồn tại hay không
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Không tìm thấy đơn xin nghỉ.' })
    }

    // Cập nhật trạng thái thành "rejected"
    leaveRequest.status = 'rejected'

    // Lưu thay đổi vào cơ sở dữ liệu
    const updatedLeaveRequest = await leaveRequest.save()

    return res.status(200).json(updatedLeaveRequest) // Trả về đơn xin nghỉ đã được cập nhật
  } catch (error) {
    return res.status(500).json({ message: 'Có lỗi xảy ra.', error })
  }
})

// API để xóa toàn bộ người dùng
router.delete('/deleteAll', async (req, res) => {
  try {
    await LeaveRequest.deleteMany() // Xóa toàn bộ người dùng trong bảng User
    res.status(200).json({ message: 'All leave requests have been deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete leave requests', error })
  }
})

module.exports = router
