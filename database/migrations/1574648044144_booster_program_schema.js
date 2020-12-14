'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BoosterProgramSchema extends Schema {
  up () {
    this.create('booster_programs', (table) => {
      table.increments()
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users");
      table.string("starting_elo", 30).notNullable();
      table.string("target_elo", 30).notNullable();
      table.float("price").notNullable();
      table.string("description", 511).notNullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('booster_programs')
  }
}

module.exports = BoosterProgramSchema
