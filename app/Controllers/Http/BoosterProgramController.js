'use strict'

const BoosterProgram = use("App/Models/BoosterProgram");
const Rating = use("App/Models/Rating");
const ForbiddenException = use("App/Exceptions/ForbiddenException");
const AuthorizationService = use("App/Services/AuthorizationService");
const Config = use("Config");
const rolesObj = Config.get("roles");

class BoosterProgramController {
    /**
   * Show a list of all BoosterProgram.
   * GET BoosterProgram
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index() {
    return await BoosterProgram.all();
  }

  /**
   * Create/save a new BoosterProgram.
   * POST BoosterProgram
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const user = auth.user;
    const boosterProgramData = request.only([
      "starting_elo",
      "target_elo",
      "price",
      "description"
    ]);
    await user.boosterprograms().create(boosterProgramData);
    response.status(201).send({});
  }

  /**
   * Display a single boosterprogram.
   * GET boosterProgram/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async show({ request: { boosterProgram } }) {
    const ratings = await boosterProgram.ratings().fetch();
    let totalRating = 0;
    let totalRated = 0;
    let latestRatings = [];
    const promises = ratings.rows.reverse().map(async (rating, idx) => {
      totalRating += rating.rating;
      totalRated += 1;
      if (idx < 5) {
        const ratingOwner = await rating.user().first();
        rating.username = ratingOwner.username;
        latestRatings.push(rating);
      }
    });
    await Promise.all(promises);

    const resultBoosterPrograms = await BoosterProgram.query()
      .where("id", boosterProgram.id)
      .first();
      resultBoosterPrograms.totalRating = totalRating;
      resultBoosterPrograms.totalRated = totalRated;
      resultBoosterPrograms.latestRatings = latestRatings;
    return resultBoosterPrograms;
  }

  /**
   * get total boosterprograms
   * 
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async getTotalBoosterPrograms() {
    //console.log("geras");
    const totalCount = await BoosterProgram.getCount()
    //console.log(totalCount);
    return totalCount;
  }

  /**
   * Update boosterprogram details.
   * PUT or PATCH boosterprogram/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ request, auth }) {
    const user = auth.user;
    const { boosterProgram } = request;
    let canEdit = false;

    try{
      AuthorizationService.verifyRole(user, rolesObj.ADMIN)
      canEdit = true;
    }
    catch(e){
      try{
        AuthorizationService.verifyPermission(boosterProgram, user);
        canEdit = true;
      }
      catch(e){

      }
    }

    if(canEdit == false) throw new ForbiddenException();
    const boosterProgramData = request.only([
        "starting_elo",
        "target_elo",
        "price",
        "description"
    ]);
    boosterProgram.merge(boosterProgramData);
    await boosterProgram.save();
  }

  /**
   * Delete a boosterProgram with id.
   * DELETE boosterprogram/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ request: { boosterProgram }, response, auth }) {
    const user = auth.user;

    AuthorizationService.verifyPermission(boosterProgram, user);

    await boosterProgram.delete();

    response.status(200).send();
  }

  /**
   * Gets boosterProgram ratings
   * GET boosterprogram/:id/ratings
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async getRatings({ request: { boosterProgram } }) {
    return boosterProgram.ratings().fetch();
  }




}

module.exports = BoosterProgramController
