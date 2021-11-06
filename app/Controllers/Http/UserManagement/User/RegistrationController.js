'use strict'
const User = use('App/Models/User');
const Domain = use('App/Models/Domain');
const Role = use('App/Models/Role');
const randomString = require('random-string');
const Event = use('Event');
const Env = use('Env');

// const sendSms = use('App/HelperFunctions/SendSms');

// 10 minutes
const verification_code_validity = 600000;

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
        length: 6,
        numeric: true,
        letters: false,
        special: false,
      });

      await user.save();

      if (user) {
        const domain = new Domain()
        domain.domain_name = domain_name
        domain.user_id = user.id
        // domain.is_active = true
        await domain.save()


        const mailDetails = {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          verification_code: user.verification_code
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

  async verifyAccount({ response, request }) {
    try {
      const { verification_code } = request.post()

      if (!verification_code) {
        return response.status(400).json({
          status: 'Bad Request',
          message: 'Verification code is required.',
          status_code: 400,
        });
      }
      const user = await User.findBy('verification_code', verification_code);

      if (!user) {
        return response.status(400).json({
          status: 'Bad Request',
          message: 'Incorrect Verification Code.',
          status_code: 400,
        });
      }

      const current_date = new Date();
      const current_time = current_date.getTime();

      const verification_code_send_date = user.updated_at;
      const verification_code_send_time = verification_code_send_date.getTime();

      const time_difference = current_time - verification_code_send_time;

      if (time_difference <= verification_code_validity) {
        user.is_verified = 1;
        user.is_active = 1;
        user.verification_code = null;
        await user.save();

        return response.status(200).json({
          status: 'Success',
          message: 'Your Account Have Been Verified.',
          status_code: 200,
        });
      } else {
        return response.status(400).send({
          status: 'Bad Request',
          message: 'Verification Code Has Expired',
          status_code: 400,
        });
      }

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

      const current_date = new Date();
      const current_time = current_date.getTime();

      const verification_code_send_date = user.updated_at;
      const verification_code_send_time = verification_code_send_date.getTime();

      const time_difference = current_time - verification_code_send_time;

      if (time_difference < verification_code_validity) {
        const timeLeft =
          Math.floor((verification_code_validity / 1000 / 60) << 0) -
          Math.floor((time_difference / 1000 / 60) << 0);
        return response.status(400).json({
          status: 'Bad Request',
          message: `You need to wait for ${timeLeft > 1
              ? `${timeLeft} minutes before you can generate another verification code.`
              : `a minute before you can generate another verification code.`
            }`,
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
      // It triggers the sendVerificationMail event
      Event.fire('sendVerificationMail', mailDetails);

      return response.status(201).json({
        status: 'Created',
        message: 'New Verification Code Sent Successfully.',
        status_code: 201,
      });
    } catch (error) {
      console.error('Resend Verification Code Error >>>>>', error);
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
