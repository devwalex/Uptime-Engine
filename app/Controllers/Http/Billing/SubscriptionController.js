'use strict'

// Require the library
// var paystack = require('paystack')('sk_test_050b26c2a17145b5e696cf824ef7ea8aecafb240');
var paystack = require('paystack-api')('sk_test_050b26c2a17145b5e696cf824ef7ea8aecafb240');
var crypto = require('crypto');
var secret = 'sk_test_050b26c2a17145b5e696cf824ef7ea8aecafb240';
const Billing = use('App/Models/Billing')
const Subscription = use('App/Models/Subscription')
const User = use('App/Models/User')

function calculateExpiryDate(days) {
  var expiryDate = new Date();
  var dateInMilliseconds = days * 24 * 60 * 60 * 1000;
  expiryDate.setTime(expiryDate.getTime() + dateInMilliseconds);
  return expiryDate;
}

class SubscriptionController {

  async tokenizeCard({ request, response, auth }) {
    try {
      const { plan_code } = request.post()
      const authenticatedUser = await auth.current.user;

      const initializeTransaction = await paystack.transaction.initialize({
        email: authenticatedUser.email,
        amount: '5000',
        channels: ['card']
      })

      const billing = new Billing()
      billing.user_id = authenticatedUser.id
      await billing.save()

      const subscription = new Subscription()
      subscription.user_id = authenticatedUser.id
      subscription.plan_code = plan_code
      subscription.trial_period = 14
      await subscription.save()


      return response.status(201).json({
        status: 'Success',
        message: 'Authorization URL created.',
        status_code: 201,
        results: initializeTransaction.data
      });

    } catch (error) {
      console.error('tokenizeCard Error ==>', error);
      return response.status(500).json({
        status: 'Internal Server Error',
        message: 'An unexpected error occurred',
        status_code: 500,
        error,
      });
    }
  }

  async verifyCard({ request, response, auth }) {
    try {
      const authenticatedUser = await auth.current.user;
      const { reference } = request.post()

      const verify = await paystack.transaction.verify({ reference })

      console.log('verif=========================', verify);

      const billing = await Billing.query().where('user_id', authenticatedUser.id).first()
      if (!billing.is_verified) {

        if (verify.data.status === 'success') {
          billing.email = verify.data.customer.email
          billing.customer_code = verify.data.customer.customer_code
          billing.authorization = JSON.stringify(verify.data.authorization)
          billing.is_active = true
          billing.is_verified = true
          await billing.save()

          // Refund 
          await paystack.refund.create({ transaction: verify.data.id, amount: verify.data.amount })

        } else {
          return response.status(400).json({
            status: 'Bad Request',
            message: 'Failed to verify card.',
            status_code: 400,
          });
        }
      }

      return response.status(201).json({
        status: 'Success',
        message: 'Card Verified Successfully.',
        status_code: 201,
      });

    } catch (error) {
      console.error('tokenizeCard Error ==>', error);
      return response.status(500).json({
        status: 'Internal Server Error',
        message: 'An unexpected error occurred',
        status_code: 500,
        error,
      });
    }
  }

  async subscribe({ request, response, auth }) {
    try {
      // const { plan_code } = request.post()
      const authenticatedUser = await auth.current.user;

      const billing = await Billing.query().where('user_id', authenticatedUser.id).where('is_active', true).first()
      const subscription = await Subscription.query().where('user_id', authenticatedUser.id).first()



      const processSubscription = await paystack.subscription.create({
        customer: billing.customer_code,
        plan: subscription.plan_code,
        authorization: JSON.parse(billing.authorization)
      })



      console.log('processSubscription', processSubscription);

      return response.status(201).json({
        status: 'Success',
        message: 'Authorization URL created.',
        status_code: 201,
        results: processSubscription.data
      });

    } catch (error) {
      console.error('Subscribe Error ==>', error);
      return response.status(500).json({
        status: 'Internal Server Error',
        message: 'An unexpected error occurred',
        status_code: 500,
        error,
      });
    }
  }

  async verifySubscription({ request, response }) {
    try {

      //validate event
      // var hash = crypto.createHmac('sha512', secret).update(JSON.stringify(request.body)).digest('hex');
      // if (hash === request.headers['x-paystack-signature']) {
      // // Retrieve the request's body
      // var event = request.body;
      // // Do something with event  
      // console.log('event', event);
      // }

      var result = request.body;

      if (result.event === 'subscription.create') {



      }
      return response.status(201).json({
        status: 'Success',
        message: 'Verify Subscription Successful.',
        status_code: 201,
        results: event
      });

    } catch (error) {
      console.error('Subscribe Error ==>', error);
      return response.status(500).json({
        status: 'Internal Server Error',
        message: 'An unexpected error occurred',
        status_code: 500,
        error,
      });
    }
  }

  async paymentWebHook({ request, response }) {
    try {
      console.log('Here', request.body);
      
      // validate event
      var hash = crypto.createHmac('sha512', secret).update(JSON.stringify(request.body)).digest('hex');

      console.log('Compare', hash, request.header('x-paystack-signature'));

      if (hash === request.header('x-paystack-signature')) {

      var result = request.body;
      console.log('result', result);

      const user = await User.findBy('email', result.data.customer.email)
      if (result.event === 'charge.success') {
        const billing = await Billing.query().where('user_id', user.id).first()
        if (!billing.is_verified) {
          if (result.data.status === 'success') {
            billing.email = result.data.customer.email
            billing.customer_code = result.data.customer.customer_code
            billing.authorization = JSON.stringify(result.data.authorization)
            billing.is_active = true
            billing.is_verified = true
            await billing.save()

            // Refund 
            await paystack.refund.create({ transaction: result.data.id, amount: result.data.amount })

          } else {
            return response.status(400).json({
              status: 'Bad Request',
              message: 'Failed to verify card.',
              status_code: 400,
            });
          }
        }
        response.send(200);
      } else if (result.event === 'subscription.create') {

        const subscription = await Subscription.query().where('user_id', user.id).first()
        subscription.is_active = true
        subscription.start_date = new Date()
        await subscription.save()

        response.send(200);

      }


      }
    } catch (error) {
      console.error('paymentWebHook Error ==>', error);
      return response.status(500).json({
        status: 'Internal Server Error',
        message: 'An unexpected error occurred',
        status_code: 500,
        error,
      });
    }
  }
}

module.exports = SubscriptionController
