'use strict'

const BoosterProgram = use("App/Models/BoosterProgram");
const NotFoundException = use("App/Exceptions/NotFoundException");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class FindBoosterProgram {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, params: { id } }, next) {
    console.log(id); //
    let boosterProgramId = id;
    if(!boosterProgramId){
      const {boosterProgram_id} = request.only(["boosterProgram_id"]);
      boosterProgramId = boosterProgram_id;
    }
    const boosterprogram = await BoosterProgram.find(boosterProgramId);
    if(!boosterprogram){
      throw new NotFoundException("BoosterProgram not found");
    }
    request.boosterProgram = boosterprogram;
    await next()
  }

  
}

module.exports = FindBoosterProgram
