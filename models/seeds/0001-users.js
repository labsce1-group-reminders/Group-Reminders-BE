const { createFakeUsers } = require("../../helpers/fakeData");
exports.seed = function(knex, Promise) {
  return knex("users").del().then(function() {
    return knex("users").insert(createFakeUsers());
  });
};
