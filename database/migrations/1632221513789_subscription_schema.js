'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SubscriptionSchema extends Schema {
  up () {
    this.create('subscriptions', (table) => {
      table.increments()
      table.integer('user_id')
      table.string('plan_code')
      table.boolean('is_on_trial').defaultTo(false)
      table.datetime('start_date')
      table.datetime('end_date')
      table.boolean('is_active').defaultTo(false)
      table.timestamp('created_at').defaultTo(this.fn.now());
      table.timestamp('updated_at').defaultTo(this.fn.now());
    })
  }

  down () {
    this.drop('subscriptions')
  }
}

module.exports = SubscriptionSchema
