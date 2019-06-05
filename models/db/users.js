const db = require("../index.js");

module.exports = {
  add,
  find,
  update,
  remove
};

function find(filters) {
  if (filters) {
    return db("users AS u")
      .select(
        "*",
      )
      // .join("account_types AS a", { "u.account_type_id": "a.id" })
      .where(filters);
  }
  return db("users AS u")
    .select(
      "*",

    )
    // .join("account_types AS a", { "u.account_type_id": "a.id" });
}

function add(user) {
  return db("users")
    .insert(user, ["*"])
    .then(u => find({ "u.id": u[0].id }).first());
}

function update(filter, changes) {
  return db("users")
    .update(changes, ["*"])
    .where(filter)
    .then(u => find({ "u.id": u[0].id }).first());
}

function remove(filter) {
  return db("users")
    .where(filter)
    .del();
}
