const { hooks } = require('@adonisjs/ignitor');

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
