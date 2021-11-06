'use strict';

class AddDomain {
  get rules() {
    return {
      // validation rules
      domain_name: 'required|url|unique:domains,domain_name',
      user_id: 'required|integer',
    };
  }

  get messages() {
    return {
      'domain_name.required': 'Domain name is required.',
      'domain_name.url': 'Domain name must be a valid url.',
      'domain_name.unique': 'This domain already exist in our system.',
      'user_id.required': 'User is required.',
      'user_id.integer': 'Please add a valid user.'
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

module.exports = AddDomain;
