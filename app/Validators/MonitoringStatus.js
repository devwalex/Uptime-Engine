'use strict'

class MonitoringStatus {
  get rules() {
    return {
      // validation rules
      is_monitored: 'required|boolean',
    };
  }

  get messages() {
    return {
      'is_monitored.required': 'Monitoring status is required.',
      'is_monitored.boolean': 'Monitoring status must be either true or false.',
    };
  }

  async fails(errorMessage) {
    return this.ctx.response.status(400).json({
      status: 'Bad Request',
      message: errorMessage[0].message,
      status_code: 400,
    });
  }
}

module.exports = MonitoringStatus
