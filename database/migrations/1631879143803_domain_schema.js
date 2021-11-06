'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DomainSchema extends Schema {
  up () {
    this.create('domains', (table) => {
      table.increments()
      table.string('domain_name').notNullable().unique()
      table.integer('user_id').notNullable()
      table.boolean('is_active').defaultTo(false)
      table.enum('status', ['up', 'down'])
      table.boolean('is_deleted').defaultTo(false)
      table.timestamp('created_at').defaultTo(this.fn.now());
      table.timestamp('updated_at').defaultTo(this.fn.now());
    })
  }

  down () {
    this.drop('domains')
  }
}

module.exports = DomainSchema
