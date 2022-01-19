'use strict';

class EditProfile {
  get rules() {
    return {
      first_name: 'requiredIf:first_name|alpha',
      last_name: 'requiredIf:last_name|alpha',
    };
  }

  get messages() {
    return {
      'first_name.requiredIf': 'First name is required.',
      'first_name.alpha': 'First name must only contain alphabet.',
      'last_name.requiredIf': 'Last name is required.',
      'last_name.alpha': 'Last name must only contain alphabet.',
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

module.exports = EditProfile;
