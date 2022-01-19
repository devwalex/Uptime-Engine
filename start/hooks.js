const { hooks } = require('@adonisjs/ignitor');

function convertDateInMillisecondToDay(date) {
  return date / (24 * 60 * 60 * 1000);
}
hooks.after.providersRegistered(async () => {
  const Validator = use('Validator');
  const Database = use('Database');

  const existsFn = async (data, field, message, args, get) => {
    const value = get(data, field);
    if (!value) {
      /**
       * skip validation if value is not defined. `required` rule
       * should take care of it.
       */
      return;
    }

    const [table, column, secondColumn, secondValue] = args;

    const row = await Database.table(table)
      .where(column, value)
      .where(secondColumn, secondValue)
      .first();
    if (row) {
      throw message;
    }
  };

  const checkDomainOrIP = async (data, field, message, args, get) => {
    const value = get(data, field);
    if (!value) {
      /**
       * skip validation if value is not defined. `required` rule
       * should take care of it.
       */
      return;
    }

    if (data.type === 'ip_address' && !value.match(/^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/)) {
      throw 'Please enter a valid ip address.';
    }

    if (data.type === 'domain_name' && !value.match(/https?:\/\/(www\.)?([-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}|localhost)\b([-a-zA-Z0-9@:%_+.~#?&\/\/=]*)/i)) {
      throw 'Please enter a valid domain name.';
    }
  };

  Validator.extend('exists', existsFn);
  Validator.extend('checkDomainOrIp', checkDomainOrIP);
});

hooks.after.httpServer(async () => {

  // const Bull = use('Rocketseat/Bull');
  // const Job = use('App/Jobs/PingDomain');
  // const Domain = use('App/Models/Domain');
  const Subscription = use('App/Models/Subscription');
  const Billing = use('App/Models/Billing');
  var paystack = require('paystack-api')('sk_test_050b26c2a17145b5e696cf824ef7ea8aecafb240');
  
  console.log('Started Hook');
    const schedule = require('node-schedule');
    const count = 0;

    schedule.scheduleJob("* * * * *", async function () {
    try {
  
      const subscriptions = await Subscription.query().where('trial_period', '>' ,  0).where('is_deleted', false).fetch()
  
      let expired = [];
      subscriptions.toJSON().forEach(async (subscription) => {
        console.log('Date', convertDateInMillisecondToDay(Date.now() - Date.parse(subscription.created_at)));
        console.log('Days left', convertDateInMillisecondToDay(subscription.trial_period - (Date.now() - Date.parse(subscription.created_at))));
        if (convertDateInMillisecondToDay(Date.now() - Date.parse(subscription.created_at)) >= subscription.trial_period) {
          expired.push(subscription.user_id);
        }
      });
      
      console.log('expired', expired);
  
      if (expired.length > 0) {
        await Subscription.query().whereIn('user_id', expired).update({trial_period: 0})
    
        const billings = await Billing.query().whereIn('user_id', expired).where('is_active', true).fetch()
    
        console.log('billing', billings.toJSON());
    
        for (const billing of billings.toJSON()) {
          const subscription = await Subscription.query().where('user_id', billing.user_id).where('is_deleted', false).where('is_active', false).first()
          const processSubscription = await paystack.subscription.create({
            customer: billing.customer_code,
            plan: subscription.plan_code,
            authorization: JSON.parse(billing.authorization)['authorization_code']
          })
          console.log('processSubscription>>', processSubscription);

          // subscription.is_active = true;
          // subscription.start_date = Date.now()
          // await subscription.save()
    
        }
  
      }
    } catch (error) {
      console.log('Error', error.error);
    }
  
  
    });
  
  });
