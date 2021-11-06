'use strict'

const Domain = use('App/Models/Domain');
const User = use('App/Models/User');

class DomainController {

  async addDomain({ request, response }) {
    try {
      const { domain_name, user_id } = request.post();

      const user = await User.query()
      .where('id', user_id)
      .where('is_deleted', false)
      .first()


      if (!user) {
        return response.status(404).json({
          status: 'Not Found',
          message: 'User not found.',
          status_code: 404,
        });
      }

      const domain = new Domain()
      domain.domain_name = domain_name
      domain.user_id = user_id
      domain.is_active = true
      await domain.save()

      return response.status(201).json({
        status: 'Success',
        message: 'Domain Added Successful.',
        status_code: 201,
      });

    } catch (error) {
      console.error('Add Domain Error ==>', error);
      return response.status(500).json({
        status: 'Internal Server Error',
        message: 'An unexpected error occurred',
        status_code: 500,
        error,
      });
    }
  }

}

module.exports = DomainController
