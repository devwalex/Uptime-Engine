'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BillingsSchema extends Schema {
  up () {
    this.create('billings', (table) => {
      table.increments()
      table.integer('user_id')
      table.string('email')
      table.text('authorization')
      table.string('customer_code')
      table.boolean('is_active').defaultTo(false)
      table.boolean('is_verified').defaultTo(false)
      table.boolean('is_deleted').defaultTo(false)
      table.timestamp('created_at').defaultTo(this.fn.now());
      table.timestamp('updated_at').defaultTo(this.fn.now());
    })
  }

  down () {
    this.drop('billings')
  }
}

module.exports = BillingsSchema
