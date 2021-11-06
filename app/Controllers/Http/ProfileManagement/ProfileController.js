'use strict'

const User = use('App/Models/User');


class ProfileController {
  async viewProfile({ response, auth }) {
    try {
      const authenticatedUser = await auth.current.user;

      const user = await User.query()
        .select(
          'id',
          'first_name',
          'last_name',
          'email',
          'phone_number',
          'role_id',
          'created_at'
        )
        .where('id', authenticatedUser.id)
        .with('role', (builder) => {
          builder.setVisible(['role_label']);
        })
        .first();

      return response.status(200).json({
        status: 'Success',
        message: 'User Profile',
        results: user,
        status_code: 200,
      });
    } catch (error) {
      console.error('View Profile >>>>>>', error);
      return response.status(500).json({
        status: 'Internal Server Error',
        message: 'An unexpected error occurred.',
        status_code: 500,
      });
    }
  }

  async editProfile({ response, request, auth }) {
    try {
      const {
        first_name,
        last_name,
        phone_number,
      } = request.post();
      const authenticatedUser = await auth.current.user;

      authenticatedUser.first_name = first_name;
      authenticatedUser.last_name = last_name;
      authenticatedUser.phone_number = phone_number;
      await authenticatedUser.save();

      return response.status(201).json({
        status: 'Created',
        message: 'Profile Updated Successfully.',
        status_code: 201,
      });
    } catch (error) {
      console.error('Edit Profile >>>>>>', error);
      return response.status(500).json({
        status: 'Internal Server Error',
        message: 'An unexpected error occurred.',
        status_code: 500,
      });
    }
  }
}

module.exports = ProfileController
