'use strict'

class EditProject {
  get rules() {
    return {
      // validation rules
      project_name: 'required|string',
    };
  }

  get messages() {
    return {
      'project_name.required': 'Project name is required.',
      'project_name.string': 'Project name must be a string.',
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

module.exports = EditProject
