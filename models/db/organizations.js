const db = require("../index");

module.exports = {
    get,
    add,
    find,
    update,
    remove,
};

/**
 * Get all Organizations from the database
 * message
 *
 * @function
 * @returns {Promise} Promise that resolves to the new organization Object
 */
function get() {
     return db("organizations AS m")
        .select(
            "*"
        )
}

/**
 * Adds a new Organization to the database, and then returns the newly created
 * message
 *
 * @function
 * @param  {Object} organization - An Organization object
 * @returns {Promise} Promise that resolves to the new organization Object
 */
function add(organization) {
    return db("organizations")
        .insert(organization, ["*"])
        .then(m => find({ "m.id": m[0].id }).first());
}

/**
 * Finds a particular organization or set of organization based on the contents of a
 * filters object
 *
 * @param  {Object} filters - A filter object to be passed to the "where" clause
 * @returns {Promise} Promise that resolves to an array of found an Organization objects
 */
function find(filters) {
    return db("organizations AS m")
        .select(
            "*"
        )
        .where(filters)
}

/**
 * Updates a record or set of records based on the key/value pairs in the
 * filter object
 *
 * @param  {Object} filter - A filter object to be passed to the "where" clause
 * @param  {Object} message - An object containing the changes you'd like to make to an  Organization(s) selected by the filter object
 * @returns {Promise}
 */
function update(filter, organization) {
    return db("organizations AS m")
        .update(organization, ["*"])
        .where(filter)
        // .then(m => find({ "m.id": m[0].id }).first());
}

/**
 * Deletes a single Organization or set of Organizations based on the key/value pairs
 * contained within the filter object.
 *
 * @param  {Object} filter - A filter object to be passed to the "where" clause
 * @returns {Promise} A Promise that resolves to the number of records deleted
 */
function remove(filter) {
    return db("organizations AS m")
        .where(filter)
        .delete();
}
