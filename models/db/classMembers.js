const db = require("../index");

module.exports = {
  get,
  add,
  find,
  update,
  remove
};

/**
 * Get a list of Class Members
 *
 * @function
 * @returns {Promise} - A Promise that resolves to an array of Class Member objects
 */
function get() {
  return db("class_members")
      .select(
          "*"
      )
}

/**
 * Find a Class Member or set of Class Members in the database
 *
 * @function
 *
 * @param {Object} filters - A filters object to pass to the SQL WHERE clause
 * @see https://knexjs.org/#Builder-where
 *
 * @returns {Promise} - A Promise that resolves to an array of Class Member objects
 */
function find(filters) {
  return db("class_members AS cm")
      .select(
          "*"
      )
      .where(filters);
}

/**
 * Add a Class Member to the Database
 *
 * @function
 *
 * @param {Object} teamMember - A Class Member object
 * @see https://knexjs.org/#Builder-insert
 *
 * @returns {Promise} - A Promise that resolves to the newly created Class Member
 */
function add(classMember) {
  return db("class_members")
    .insert(classMember, ["*"])
}

/**
 * Update a Class Member to the Database
 *
 * @function
 *
 * @param {Object} filters - A filters object to pass to the SQL WHERE clause
 * @see https://knexjs.org/#Builder-where
 *
 * @param {Object} changes - An object representing the keys to update and their values
 * @see https://knexjs.org/#Builder-update
 *
 * @returns {Promise} - A Promise that resolves to the updated Class Member(s)
 */
function update(filters, changes) {
  return db("class_members AS cm")
    .update(changes, ["*"])
    .where(filters)
    // .then(tm => find({ "cm.id": tm[0].id }).first());
}

/**
 * Deletes a specific Class Member or set of Class Members from the database
 *
 * @function
 *
 * @param {Object} filters - A filters object to pass to the SQL WHERE clause
 * @see https://knexjs.org/#Builder-where
 *
 * @returns {Promise} A promise that resolves to the number of Class Member(s) deleted
 */
function remove(filters) {
  return db("class_members AS cm")
    .where(filters)
    .del();
}
