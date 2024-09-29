const LeaveType = require('../models/LeaveType')

const initializeLeaveTypes = async () => {
  try {
    const leaveTypes = [
      'Annual Leave',
      'Sick Leave',
      'Casual Leave',
      'Maternity Leave',
      'Paternity Leave',
      'Unpaid Leave',
      'Marriage Leave',
      'Study Leave',
      'Adoption Leave',
    ]

    for (const leaveType of leaveTypes) {
      const existingLeaveType = await LeaveType.findOne({
        leaveType: leaveType,
      })

      if (!existingLeaveType) {
        await LeaveType.create({ leaveType: leaveType })
      } else {
      }
    }
  } catch (error) {
    console.error('Error initializing leave types:', error)
  }
}

module.exports = initializeLeaveTypes
