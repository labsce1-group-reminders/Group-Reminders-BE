const { createFakeOrganizations } = require("../../helpers/fakeData");
exports.seed = function(knex, Promise) {
  return knex('organizations').del()
    .then(function () {
      return knex('organizations').insert(createFakeOrganizations());
    });
};
