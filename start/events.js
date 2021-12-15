const Event = use('Event');
const Mail = use('Mail');

Event.on('sendVerificationMail', async (mailDetails) => {
  await Mail.send('emails.verification_email', mailDetails, (message) => {
    message.from('no-reply@uptime.ng', 'Uptime.ng');
    message.to(mailDetails.email);
    message.subject('Verify Your Account');
  });
});

Event.on('resetPasswordMail', async (mailDetails) => {
  await Mail.send('emails.reset_password_email', mailDetails, (message) => {
    message.from('no-reply@uptime.ng', 'Uptime.ng');
    message.to(mailDetails.email);
    message.subject('Reset Password Code');
  });
});

Event.on('sendProjectCurrentStatusReport', async (mailDetails) => {
  await Mail.send('emails.project_report_status_email', mailDetails, (message) => {
    message.from('no-reply@uptime.ng', 'Uptime.ng');
    message.to(mailDetails.email);
    message.subject('Your Project Current Status Report');
  });
});

Event.on('sendSslExpiryReport', async (mailDetails) => {
  await Mail.send('emails.project_ssl_expiry_report_email', mailDetails, (message) => {
    message.from('no-reply@uptime.ng', 'Uptime.ng');
    message.to(mailDetails.email);
    message.subject('Your Project SSL Expiry Report');
  });
});
