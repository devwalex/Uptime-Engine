'use strict'
var paystack = require('paystack')('sk_test_050b26c2a17145b5e696cf824ef7ea8aecafb240');

class PlanController {
  async getPlans({ request, response }) {
    try {

      const plans = await paystack.plan.list()

      if (!plans) {
        return response.status(400).json({
          status: 'Bad Request',
          message: 'Failed to Fetch Plan',
          status_code: 201,
        });
      }
      const filteredPlans = plans.data.filter((plan) =>  plan.is_deleted === false && plan.is_archived === false)

      const results = filteredPlans.map((plan) => {
        return {
          id: plan.id,
          name: plan.name,
          plan_code: plan.plan_code,
          description: plan.description,
          amount: plan.amount / 100,
          interval: plan.interval,
          currency: plan.currency,
        }
      })

      return response.status(201).json({
        status: 'Success',
        message: 'Fetch Plan Successfully.',
        status_code: 201,
        results
      });

    } catch (error) {
      console.error('getPlans Error ==>', error);
      return response.status(500).json({
        status: 'Internal Server Error',
        message: 'An unexpected error occurred',
        status_code: 500,
        error,
      });
    }
  }
}

module.exports = PlanController
