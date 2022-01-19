'use strict'

const User = use('App/Models/User');

class LoginController {
  async login({ request, response, auth }) {
    try {
      const { email, password } = request.all();
      if (!email) {
        return response.status(400).json({
          status: 'Bad Request',
          message: 'Email is required.',
          status_code: 400,
        });
      }

      const user = await User.query()
        .where('email', email)
        .with('role', (builder) => {
          builder.setVisible(['role_label']);
        })
        .first();

      if (!user) {
        return response.status(400).json({
          status: 'Bad Request',
          message: 'This email is not associated with any account.',
          status_code: 400,
        });
      }

      if (user.is_verified === 0) {
        return response.status(401).json({
          status: 'Unauthorized',
          message:
            'Your account have not been verified, please verify your account.',
          status_code: 401,
        });
      }

      if (user.is_active === 0) {
        return response.status(401).json({
          status: 'Unauthorized',
          message:
            'Your account have been deactivated, please contact the admin.',
          status_code: 401,
        });
      }

      const token = await auth.attempt(email, password);

      return response.status(200).json({
        status: 'Success',
        message: 'Logged In Successfully.',
        status_code: 200,
        user,
        token,
      });
    } catch (error) {
      if (error.authScheme === 'jwt') {
        return response.status(400).json({
          status: 'Bad Request',
          message: 'Incorrect login details, please try again.',
          status_code: 400,
        });
      }
      console.error('Login Error >>>>>', error);
      return response.status(500).json({
        status: 'Internal Server Error',
        message: 'An unexpected error occurred.',
        status_code: 500,
        error,
      });
    }
  }
}

module.exports = LoginController
