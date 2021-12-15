'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProjectsSchema extends Schema {
  up () {
    this.create('projects', (table) => {
      table.increments()
      table.integer('user_id').notNullable()
      table.string('address').notNullable()//.unique()
      table.string('description').notNullable()
      table.string('current_status')
      table.datetime('last_status_change_time')
      table.string('type').notNullable()
      table.datetime('ssl_expiration_date')
      table.boolean('has_ssl_expired').defaultTo(false)
      table.boolean('is_monitored').defaultTo(false)
      table.boolean('is_active').defaultTo(false)
      table.boolean('is_deleted').defaultTo(false)
      table.timestamp('created_at').defaultTo(this.fn.now());
      table.timestamp('updated_at').defaultTo(this.fn.now());
    })
  }

  down () {
    this.drop('projects')
  }
}

module.exports = ProjectsSchema
