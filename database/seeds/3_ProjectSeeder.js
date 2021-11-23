'use strict'

/*
|--------------------------------------------------------------------------
| ProjectSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Database = use('Database');
const User = use('App/Models/User');

class ProjectSeeder {
  async run() {
    const user = await User.findBy('email', 'admin@uptime.ng');

    await Database.raw('SET FOREIGN_KEY_CHECKS = 0;');
    await Database.truncate('projects');
    // Insert Project Into The Database
    await Database.table('projects').insert([
  {
    user_id: user.id,
    description: 'Jumia',
    address: 'https://jumia.com',
    type: 'domain_name',
    current_status: null,
    last_status_change_time: null,
    ssl_expiration_date: null,
    is_monitored: true,
    is_active: true
  },
  {
    user_id: user.id,
    description: 'Bet9ja',
    address: 'https://https://bet9ja.com',
    type: 'domain_name',
    current_status: null,
    last_status_change_time: null,
    ssl_expiration_date: null,
    is_monitored: true,
    is_active: true
  },
  {
    user_id: user.id,
    description: 'Spotify',
    address: '35.186.224.25',
    type: 'ip_address',
    current_status: null,
    last_status_change_time: null,
    ssl_expiration_date: null,
    is_monitored: true,
    is_active: true
  },
  {
    user_id: user.id,
    description: 'Google',
    address: '216.58.206.238',
    type: 'ip_address',
    current_status: null,
    last_status_change_time: null,
    ssl_expiration_date: null,
    is_monitored: true,
    is_active: true
  },
  {
    user_id: user.id,
    description: 'Bing',
    address: 'https://bing.com',
    type: 'domain_name',
    current_status: null,
    last_status_change_time: null,
    ssl_expiration_date: null,
    is_monitored: true,
    is_active: true
  },
  {
    user_id: user.id,
    description: 'Apple Music',
    address: 'https://music.apple.com',
    type: 'domain_name',
    current_status: null,
    last_status_change_time: null,
    ssl_expiration_date: null,
    is_monitored: true,
    is_active: true
  },
  {
    user_id: user.id,
    description: 'SoundCloud',
    address: '13.32.158.104',
    type: 'ip_address',
    current_status: null,
    last_status_change_time: null,
    ssl_expiration_date: null,
    is_monitored: true,
    is_active: true
  },
  {
    user_id: user.id,
    description: 'Nairaland',
    address: 'https://www.nairaland.com',
    type: 'domain_name',
    current_status: null,
    last_status_change_time: null,
    ssl_expiration_date: null,
    is_monitored: true,
    is_active: true
  },
  {
    user_id: user.id,
    description: 'Youtube',
    address: 'https://www.youtube.com',
    type: 'domain_name',
    current_status: null,
    last_status_change_time: null,
    ssl_expiration_date: null,
    is_monitored: true,
    is_active: true
  },
  {
    user_id: user.id,
    description: 'Net Naija',
    address: 'https://www.thenetnaija.com',
    type: 'domain_name',
    current_status: null,
    last_status_change_time: null,
    ssl_expiration_date: null,
    is_monitored: true,
    is_active: true
  },
]);

    await Database.raw('SET FOREIGN_KEY_CHECKS = 1;');
  }
}


module.exports = ProjectSeeder
