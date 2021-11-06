'use strict'

const Encryption = use('Encryption');

class LogoutController {
  async logOut({ response, auth }) {
    try {
      // get current logged in user
      const user = await auth.current.user;

      const token = auth.getAuthHeader();

      await user
        .tokens()
        .where('type', 'api_token')
        .where('is_revoked', false)
        .where('token', Encryption.decrypt(token))
        .update({
          is_revoked: true,
        });

      return response.status(200).json({
        status: 'Success',
        message: 'Logged Out Successfully.',
        status_code: 200,
      });
      
    } catch (error) {
      console.error('LogOut Error >>>>>', error);
      return response.status(500).json({
        status: 'Internal Server Error',
        message: 'An unexpected error occurred.',
        status_code: 500,
        error,
      });
    }
  }
}

module.exports = LogoutController
