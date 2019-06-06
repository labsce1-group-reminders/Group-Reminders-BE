const { createFakeTrainingSeries } = require("../../helpers/fakeData");
exports.seed = function(knex, Promise) {
  return knex("training_series").del()
      .then(function() {
        return knex("training_series").insert(createFakeTrainingSeries());
  });
};
