'use strict'


const User = use('App/Models/User');
const randomString = require('random-string');
const Event = use('Event');
const Hash = use('Hash');
const Env = use('Env');

// 10 minutes
const verification_code_validity = 600000;

class PasswordController {

  async forgotPassword({ request, response }) {
    try {
      const { email } = request.post();

      const user = await User.query().where('email', email).first();

      if (!user) {
        return response.status(400).json({
          status: 'Bad Request',
          message: 'Incorrect Email.',
          status_code: 400,
        });
      }

      user.verification_code = randomString({
        length: 6,
        numeric: true,
        letters: false,
        special: false,
      });

      await user.save();


        const mailDetails = {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          verification_code: user.verification_code
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
          message: 'Incorrect reset password code.',
          status_code: 400,
        });
      }

      // Check if the new password and old password is the same
      const checkPassword = await Hash.verify(new_password, user.password);

      if (checkPassword) {
        return response.status(400).json({
          status: 'Bad Request',
          message: 'Old Password And New Password Cannot Be The Same.',
          status_code: 400,
        });
      }

      const current_date = new Date();
      const current_time = current_date.getTime();

      const verification_code_send_date = user.updated_at;
      const verification_code_send_time = verification_code_send_date.getTime();

      const time_difference = current_time - verification_code_send_time;
      if (time_difference <= verification_code_validity) {
        user.verification_code = null;
        user.password = new_password;
        await user.save();

        return response.status(201).json({
          status: 'Created',
          message: 'Reset Password Successfully.',
          status_code: 201,
        });
      } else {
        user.verification_code = null;
        await user.save();

        return response.status(400).send({
          status: 'Bad Request',
          message: 'Reset password code has expired.',
          status_code: 400,
        });
      }
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
          message: 'Old Password Is Incorrect.',
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
          message: 'Old Password And New Password Cannot Be The Same.',
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
