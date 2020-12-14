"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Rating extends Model {
  user() {
    return this.belongsTo("App/Models/User");
  }
  boosterProgram() {
    return this.belongsTo("App/Models/BoosterProgram");
  }
}

module.exports = Rating;
