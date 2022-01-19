'use strict'

const { rule } = use('Validator');

class AddProject {
  get rules() {
    return {
      // validation rules
      address: [
        rule('required'),
        rule('exists', ['projects','address','is_deleted','false']),
        rule('check_domain_or_ip'),
      ],
      project_name: 'required|string',
      type: 'required|string|in:domain_name,ip_address',      
    };
  }

  get messages() {
    return {
      'address.required': 'Address is required.',
      'address.exists': 'This domain name or ip address already exist in our system.',
      'project_name.required': 'Project name is required.',
      'project_name.string': 'Project name must be a string.',
      'type.required': 'Project type name is required.',
      'type.string': 'Project type name must be a string.',
      'type.in': 'Project type must be either domain_name or ip_address.',
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

module.exports = AddProject
