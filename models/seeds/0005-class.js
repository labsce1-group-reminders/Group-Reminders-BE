const { createFakeClasses } = require("../../helpers/fakeData");
exports.seed = function(knex, Promise) {
    return knex("classes").del()
        .then(function() {
        return knex("classes").insert(createFakeClasses());
    })
};
