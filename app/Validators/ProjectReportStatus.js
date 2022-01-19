'use strict'

const { rule } = use('Validator');

class ProjectReportStatus {
  get rules() {
    return {
      // validation rules
      current_status: 'required_without_any:ssl_expiration_date|in:up,down',
      last_status_change_time: [
        rule('required_without_any', 'ssl_expiration_date'),
        rule('dateFormat', 'YYYY-MM-DD HH:mm:ss')
      ],
      ssl_expiration_date: [
        rule('dateFormat', 'YYYY-MM-DD HH:mm:ss')
      ],
      has_ssl_expired: 'required_if:ssl_expiration_date|boolean',
      reason: 'required_when:current_status,down|string',
      load_time: 'required_when:current_status,up|number',

    };
  }

  get messages() {
    return {
      'current_status.required_without_any': 'Current status is required.',
      'current_status.in': 'Current status must be either up or down.',
      'last_status_change_time.required_without_any': 'Last status change time is required.',
      'last_status_change_time.dateFormat': 'Last status change time must be in YYYY-MM-DD HH:mm:ss format.',
      'ssl_expiration_date.dateFormat': 'SSL expiration date must be in YYYY-MM-DD HH:mm:ss format.',
      'has_ssl_expired.required_if': 'Has SSL expired is required.',
      'has_ssl_expired.boolean': 'Has SSL expired must be either true or false.',
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
