'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('first_name', 80).notNullable()
      table.string('last_name', 80).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('phone_number', 20).unique()
      table.string('password', 60).notNullable()
      table.integer('role_id').notNullable();
      table.string('verification_code')
      table.boolean('is_active').defaultTo(false)
      table.boolean('is_verified').defaultTo(false)
      table.boolean('is_deleted').defaultTo(false)
      table.timestamp('created_at').defaultTo(this.fn.now());
      table.timestamp('updated_at').defaultTo(this.fn.now());
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
