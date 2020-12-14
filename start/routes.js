"use strict";

const { validator } = use("Validator");

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", () => {
  return { greeting: "Hello world in JSON" };
});

Route.resource("users", "UserController") //
  .validator(new Map([[["users.store"], ["StoreUser"]]]))
  .middleware(
    new Map([
      [
        ["index", "show"],
        ["auth", "adminAccess"]
      ],
      [["update"], ["adminAccess", "findUser"]],
      [["show", "destroy"], ["findUser"]]
    ])
  );


Route.get("users/:id/boosterprogramas", "UserController.getBoosterPrograms").middleware([ //
  "findUser"
]);

Route.get("user/ratings", "UserController.getMyRatings").middleware(["auth"]);

//Route.get("boosterprograms/total", "BoosterProgramController.getTotalBoosterPrograms"); //

Route.get("user/boosterprograms", "UserController.getMyBoosterPrograms").middleware([ // keista
  "auth"
]);

Route.get("user", "UserController.getMyProfile").middleware(["auth"]);  // 


Route.put("users", "UserController.updateMyProfile") // update profile
  .middleware(["auth"])
  .validator("UpdateMyProfile");

Route.resource("boosterprogram", "BoosterProgramController").middleware( //
  new Map([
    
      [["show", "update", "destroy"], ["findBoosterProgram"]]
    
  ])
);


Route.get("boosterprogram", "BoosterProgramController.index"); //

Route.post("boosterprogram", "BoosterProgramController.store").middleware(["auth"]); //

Route.get("totalboosterprogram", "BoosterProgramController.getTotalBoosterPrograms"); //

Route.get(                                              //
  "boosterprogram/:id/ratings",
  "BoosterProgramController.getRatings"
).middleware(["findBoosterProgram"]);

Route.get("allratings", "RatingController.index"); //

Route.resource("ratings", "RatingController").middleware( //
  new Map([
    [["store", "destroy", "update"], ["auth"]],
    [["show", "update", "destroy"], ["findRating"]],
    [["store"], ["findBoosterProgram"]]
  ])
);

Route.post("login", "AuthController.login").middleware(["guest"]); //

Route.post("logout", "AuthController.logout").middleware(["auth"]); 

Route.post("refresh", "AuthController.refresh"); 
