const { createFakeTeamMembers } = require("../Helpers/fakeData");
exports.seed = function(knex, Promise) {
  return knex("team_members").then(function() {
    return knex("team_members").insert(createFakeTeamMembers());
  });
};
