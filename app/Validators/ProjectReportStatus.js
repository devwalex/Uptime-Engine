'use strict'

const { rule } = use('Validator');

class ProjectReportStatus {
  get rules() {
    return {
      // validation rules
      current_status: 'required|in:up,down',
      last_status_change_time: [
        rule('required'),
        rule('dateFormat', 'YYYY-MM-DD HH:mm:ss')
      ],
      ssl_expiration_date: [
        rule('dateFormat', 'YYYY-MM-DD HH:mm:ss')
      ],
      reason: 'required_when:current_status,down|string',
      load_time: 'required_when:current_status,up|number',

    };
  }

  get messages() {
    return {
      'current_status.required': 'Current status is required.',
      'current_status.in': 'Current status must be either up or down.',
      'last_status_change_time.required': 'Last status change time is required.',
      'last_status_change_time.dateFormat': 'Last status change time must be in YYYY-MM-DD HH:mm:ss format.',
      'ssl_expiration_date.dateFormat': 'SSL expiration date must be in YYYY-MM-DD HH:mm:ss format.',
      'reason.required_when': 'Reason is required when current status is down.',
      'reason.string': 'Reason must be a string.',
      'load_time.required_when': 'Load time is required.',
      'load_time.number': 'Load time must be a number.',
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

module.exports = ProjectReportStatus
