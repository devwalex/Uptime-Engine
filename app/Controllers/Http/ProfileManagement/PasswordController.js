'use strict'


const User = use('App/Models/User');
const randomString = require('random-string');
const Event = use('Event');
const Hash = use('Hash');
const Env = use('Env');


class PasswordController {

  async forgotPassword({ request, response }) {
    try {
      const { email } = request.post();

      const user = await User.query().where('email', email).first();

      if (!user) {
        return response.status(400).json({
          status: 'Bad Request',
          message: 'Incorrect email.',
          status_code: 400,
        });
      }

      user.verification_code = randomString({
        length: 30,
        numeric: true,
        letters: true,
        special: false,
      });
      await user.save();

      const appUrl = Env.get('FRONTEND_URL')
      ? Env.get('FRONTEND_URL')
      : Env.get('APP_URL');

    const verification_link = `${appUrl}/account/verify/${user.verification_code}`;

      const mailDetails = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        verification_link,
      };
        // It triggers the resetPasswordMail event
        
        Event.fire('resetPasswordMail', mailDetails);

      return response.status(200).json({
        status: 'Success',
        message: 'Reset password code has been sent to your mail.',
        status_code: 200,
      });
    } catch (error) {
      console.error('Forgot Password Error >>>>>', error);
      return response.status(500).json({
        status: 'Internal Server Error',
        message: 'An unexpected error occurred.',
        status_code: 500,
        error,
      });
    }
  }

  async resetPassword({ request, response, params: { verification_code } }) {
    try {
      const { new_password } = request.post();

      const user = await User.findBy('verification_code', verification_code);

      if (!user) {
        return response.status(400).json({
          status: 'Bad Request',
          message: 'Incorrect reset password link.',
          status_code: 400,
        });
      }

      // Check if the new password and old password is the same
      const checkPassword = await Hash.verify(new_password, user.password);

      if (checkPassword) {
        return response.status(400).json({
          status: 'Bad Request',
          message: 'Old password and new password cannot be the same.',
          status_code: 400,
        });
      }

        user.verification_code = null;
        user.password = new_password;
        await user.save();

        return response.status(201).json({
          status: 'Created',
          message: 'Reset password successfully.',
          status_code: 201,
        });

    } catch (error) {
      console.error('Reset Password Error >>>>>>>', error);
      return response.status(500).json({
        status: 'Internal Server Error',
        message: 'An unexpected error occurred.',
        status_code: 500,
        error,
      });
    }
  }

  async changePassword({ request, response, auth }) {
    try {
      const { new_password, old_password } = request.post();

      const authenticatedUser = await auth.current.user;
      const verifyPassword = await Hash.verify(
        old_password,
        authenticatedUser.password
      );

      if (!verifyPassword) {
        return response.status(400).json({
          status: 'Bad Request',
          message: 'Old password is incorrect.',
          status_code: 400,
        });
      }

      // Check if the new password and old password is the same
      const checkPassword = await Hash.verify(
        new_password,
        authenticatedUser.password
      );

      if (checkPassword) {
        return response.status(400).json({
          status: 'Bad Request',
          message: 'Old password and new password cannot be the same.',
          status_code: 400,
        });
      }

      authenticatedUser.password = new_password;
      await authenticatedUser.save();

      return response.status(201).json({
        status: 'Created',
        message: 'Changed password successfully.',
        status_code: 201,
      });
    } catch (error) {
      console.error('Change Password Error >>>>>', error);
      return response.status(500).json({
        status: 'Internal Server Error',
        message: 'An unexpected error occurred.',
        status_code: 500,
        error,
      });
    }
  }
}

module.exports = PasswordController
