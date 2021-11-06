'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DomainReportsSchema extends Schema {
  up () {
    this.create('domain_reports', (table) => {
      table.increments()
      table.integer('domain_id')
      table.enum('status', ['up', 'down'])
      table.string('reason')
      table.string('duration')
      table.timestamp('created_at').defaultTo(this.fn.now());
      table.timestamp('updated_at').defaultTo(this.fn.now());
    })
  }

  down () {
    this.drop('domain_reports')
  }
}

module.exports = DomainReportsSchema
