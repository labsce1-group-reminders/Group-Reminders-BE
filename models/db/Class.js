const db = require("../index");

module.exports = {
    get,
    add,
    find,
    update,
    remove
};

/**
 * Get a list of Class
 *
 * @function
 * @returns {Promise} - A Promise that resolves to an array of Class objects
 */
function get() {
    return db("classes")
        .select(
            "*"
        )
}

/**
 * Find a Class or set of Classes in the database
 *
 * @function
 *
 * @param {Object} filters - A filters object to pass to the SQL WHERE clause
 * @see https://knexjs.org/#Builder-where
 *
 * @returns {Promise} - A Promise that resolves to an array of Class objects
 */
function find(filters) {
    return db("classes AS c")
        .select(
            "*"
        )
        .where(filters);
}

/**
 * Add a Class object to the Database
 *
 * @function
 *
 * @param {Object} teamMember - A Class object
 * @see https://knexjs.org/#Builder-insert
 *
 * @returns {Promise} - A Promise that resolves to the newly created Class
 */
function add(newclass) {
    return db("classes")
        .insert(newclass, ["*"])
}

/**
 * Update a Class to the Database
 *
 * @function
 *
 * @param {Object} filters - A filters object to pass to the SQL WHERE clause
 * @see https://knexjs.org/#Builder-where
 *
 * @param {Object} changes - An object representing the keys to update and their values
 * @see https://knexjs.org/#Builder-update
 *
 * @returns {Promise} - A Promise that resolves to the updated Class
 */
function update(filters, changes) {
    return db("classes AS c")
        .update(changes, ["*"])
        .where(filters)
    // .then(tm => find({ "cm.id": tm[0].id }).first());
}

/**
 * Deletes a specific Class or set of Classes  from the database
 *
 * @function
 *
 * @param {Object} filters - A filters object to pass to the SQL WHERE clause
 * @see https://knexjs.org/#Builder-where
 *
 * @returns {Promise} A promise that resolves to the number of Class(es) deleted
 */
function remove(filters) {
    return db("classes AS c")
        .where(filters)
        .del();
}
