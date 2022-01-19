'use strict'

/*
|--------------------------------------------------------------------------
| RoleSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Database = use('Database');

const roles = [
  { role_label: 'Admin' },
  { role_label: 'User' },
];

class RoleSeeder {
  async run() {
    await Database.raw('SET FOREIGN_KEY_CHECKS = 0;');
    await Database.truncate('roles');
    // Insert User Role Into The Database
    await Database.table('roles').insert(roles);

    await Database.raw('SET FOREIGN_KEY_CHECKS = 1;');
  }
}

module.exports = RoleSeeder
