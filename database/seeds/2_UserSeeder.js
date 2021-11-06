'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */

const Database = use('Database');
const Hash = use('Hash');
const Role = use('App/Models/Role');

class UserSeeder {
  async run() {
    await Database.raw('SET FOREIGN_KEY_CHECKS = 0;');
    await Database.truncate('users');

    // Hash Password
    const seedPassword = await Hash.make('UPT1M3P@55');

    // Find Admin Role
    const role = await Role.findBy('role_label', 'Admin');

    // Insert Users Into The Database
    await Database.table('users').insert([
      {
        first_name: 'Uptime',
        last_name: 'Admin',
        email: 'admin@uptime.com',
        phone_number: '08012345678',
        password: seedPassword,
        is_active: true,
        is_verified: true,
        role_id: role.id
      }
    ]);
    await Database.raw('SET FOREIGN_KEY_CHECKS = 1;');
  }
}

module.exports = UserSeeder
