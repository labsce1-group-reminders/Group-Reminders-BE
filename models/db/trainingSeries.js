const db = require("../index");

module.exports = {
  get,
  add,
  find,
  update,
  remove
};

/**
 * Find a training series or set of training series in the database
 *
 * @function
 *
 * @param {Object} filters - A filters object to pass to the SQL WHERE clause
 * @see https://knexjs.org/#Builder-where
 *
 * @returns {Promise} - A Promise that resolves to an array of training series objects
 */
function find(filters) {
  return db("training_series AS ts")
    .select("*")
    .where(filters);
}


/**
 * Get all training series
 *
 * @function
 * @returns {Promise} - A Promise that resolves to an array of training series objects
 */
function get() {
  return db("training_series")
      .select("*")
}

/**
 * Add a training series to the Database
 *
 * @function
 *
 * @param {Object} series - A series object
 * @see https://knexjs.org/#Builder-insert
 *
 * @returns {Promise} - A Promise that resolves to the newly created training series
 */
function add(series) {
  return db("training_series")
    .insert(series, ["*"])
}

/**
 * Update a training series to the Database
 *
 * @function
 *
 * @param {Object} filters - A filters object to pass to the SQL WHERE clause
 * @see https://knexjs.org/#Builder-where
 *
 * @param {Object} changes - An object representing the keys to update and their values
 * @see https://knexjs.org/#Builder-update
 *
 * @returns {Promise} - A Promise that resolves to the updated training series
 */
function update(filter, changes) {
  return db("training_series as ts")
    .update(changes, ["*"])
    .where(filter)
    .then(ts => find({ "ts.id": ts[0].id }).first());
}

/**
 * Deletes a specific training series or set of training series from the database
 *
 * @function
 *
 * @param {Object} filters - A filters object to pass to the SQL WHERE clause
 * @see https://knexjs.org/#Builder-where
 *
 * @returns {Promise} A promise that resolves to the number of training series deleted
 */
function remove(filter) {
  return db("training_series")
    .where(filter)
    .del();
}
