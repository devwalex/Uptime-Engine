'use strict';

class ChangePassword {
  get rules() {
    return {
      // validation rules
      old_password: 'required|string',
      new_password: 'required|string|min:6',
    };
  }

  get messages() {
    return {
      'old_password.required': 'Old password is required.',
      'new_password.required': 'New password is required.',
      'new_password.min': 'New password must be at least 6 characters.',
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

module.exports = ChangePassword;
