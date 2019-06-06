const { createFakeClassMembers } = require("../../helpers/fakeData");
exports.seed = function(knex, Promise) {
  return knex("class_members").del()
      .then(function() {
        return knex("class_members").insert(createFakeClassMembers());
  })
};
