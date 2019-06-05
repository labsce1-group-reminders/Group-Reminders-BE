exports.seed = function(knex, Promise) {
  return knex("services").del().then(function() {
    return knex("services").insert([
      { name: "twilio" },
      { name: "sendgrid" },
      { name: "slack" }
    ]);
  });
};
