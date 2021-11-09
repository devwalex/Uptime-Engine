'use strict'
const User = use('App/Models/User');
const Domain = use('App/Models/Domain');
const Role = use('App/Models/Role');
const randomString = require('random-string');
const Event = use('Event');
const Env = use('Env');

// const sendSms = use('App/HelperFunctions/SendSms');
class RegistrationController {
  async register({ request, response }) {
    try {
      const {
        first_name,
        last_name,
        email,
        password,
        domain_name,
      } = request.post();

      // Find the role of User
      const role = await Role.findBy('role_label', 'User');

      const user = new User();
      user.first_name = first_name;
      user.last_name = last_name;
      user.email = email;
      user.password = password;
      user.role_id = role.id;
      user.verification_code = randomString({
        length: 30,
        numeric: true,
        letters: true,
        special: false,
      });

      await user.save();

      if (user) {
        const domain = new Domain()
        domain.domain_name = domain_name
        domain.user_id = user.id
        // domain.is_active = true
        await domain.save()


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

        // It triggers the sendVerificationMail event
        Event.fire('sendVerificationMail', mailDetails);
      }

      return response.status(201).json({
        status: 'Success',
        message: 'Registration Successful.',
        status_code: 201,
      });

    } catch (error) {
      console.error('Registration Error ==>', error);
      return response.status(500).json({
        status: 'Internal Server Error',
        message: 'An unexpected error occurred',
        status_code: 500,
        error,
      });
    }
  }

  async verifyAccount({ response, params: { verification_code } }) {
    try {
      const user = await User.findBy('verification_code', verification_code);

      if (!user) {
        return response.status(400).json({
          status: 'Bad Request',
          message: 'Incorrect verification link.',
          status_code: 400,
        });
      }

      user.is_verified = 1;
      user.is_active = 1;
      user.verification_code = null;
      await user.save();

      return response.status(200).json({
        status: 'Success',
        message: 'Your account have been verified successfully.',
        status_code: 200,
      });

    } catch (error) {
      console.error('Account Verification Error >>>>>', error);
      return response.status(500).json({
        status: 'Internal Server Error',
        message: 'An unexpected error occurred.',
        status_code: 500,
        error,
      });
    }
  }

  async resendVerificationCode({ response, request }) {
    try {
      const { email } = request.post();

      if (!email) {
        return response.status(400).json({
          status: 'Bad Request',
          message: 'Email is required.',
          status_code: 400,
        });
      }

      const user = await User.findBy('email', email);

      if (!user) {
        return response.status(400).json({
          status: 'Bad Request',
          message: 'Incorrect Email.',
          status_code: 400,
        });
      }

      if (user.is_verified) {
        return response.status(400).json({
          status: 'Bad Request',
          message: 'Your account is already verified',
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

      // It triggers the sendVerificationMail event
      Event.fire('sendVerificationMail', mailDetails);

      return response.status(201).json({
        status: 'Created',
        message: 'New verification link sent successfully.',
        status_code: 201,
      });
    } catch (error) {
      console.error('Resend Verification link Error >>>>>', error);
      return response.status(500).json({
        status: 'Internal Server Error',
        message: 'An unexpected error occurred.',
        status_code: 500,
        error,
      });
    }
  }
}

module.exports = RegistrationController
