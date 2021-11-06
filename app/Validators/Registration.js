'use strict'

class Registration {
  get rules () {
    return {
      first_name: 'required|alpha',
      last_name: 'required|alpha',
      // phone_number: 'required|integer|max:14|min:11|unique:users,phone_number',
      email: 'required|email|unique:users,email',
      password: 'required|min:6',
      domain_name: 'required|url|unique:domains,domain_name'
    }
  }

  get messages() {
    return {
      'first_name.required': 'First name is required.',
      'first_name.alpha': 'First name must only contain alphabet.',
      'last_name.required': 'Last name is required.',
      'last_name.alpha': 'Last name must only contain alphabet.',
      // 'phone_number.required': 'Phone number is required.',
      // 'phone_number.unique': 'This phone number is already registered.',
      // 'phone_number.max': 'Phone must contain at most 14 digits.',
      // 'phone_number.min': 'Phone must contain at least 11 digits.',
      // 'phone_number.integer': 'Phone must contain only digits.',
      'email.required': 'Email is required.',
      'email.email': 'You must provide a valid email address.',
      'email.unique': 'This email is already registered.',
      'password.required': 'Password is required.',
      'password.min': 'Password must be atleast six characters.',
      'domain_name.required': 'Domain name is required.',
      'domain_name.url': 'Domain name must be a valid url.',
      'domain_name.unique': 'This domain already exist in our system.',
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

module.exports = Registration
