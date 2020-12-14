"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class RatingSchema extends Schema {
  up() {
    this.create("ratings", table => {
      table.increments();
      table
        .integer("booster_program_id")
        .unsigned()
        .references("id")
        .inTable("booster_programs");
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users");
      table.integer("rating").notNullable();
      table.string("comment", 255);
      table.timestamps();
    });
  }

  down() {
    this.drop("ratings");
  }
}

module.exports = RatingSchema;
