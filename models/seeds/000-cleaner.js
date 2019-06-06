exports.seed = function(knex, Promise) {
  return knex.schema.raw(
    "TRUNCATE users, organizations, training_series, classes, class_members, services, tokens, messages, notifications, responses RESTART IDENTITY;"
  );
};
