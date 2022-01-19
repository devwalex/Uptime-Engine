'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReportsSchema extends Schema {
  up () {
    this.create('reports', (table) => {
      table.increments()
      table.integer('project_id').notNullable()
      table.string('status')
      table.string('reason')
      table.string('load_time')
      table.datetime('last_status_change_time')
      table.timestamp('created_at').defaultTo(this.fn.now());
      table.timestamp('updated_at').defaultTo(this.fn.now());
    })
  }

  down () {
    this.drop('reports')
  }
}

module.exports = ReportsSchema
