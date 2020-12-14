'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BoosterProgram extends Model {
    user() {
        return this.belongsTo("App/Models/User");
      }
    
    ratings() {
        return this.hasMany("App/Models/Rating");
    }
}

module.exports = BoosterProgram
