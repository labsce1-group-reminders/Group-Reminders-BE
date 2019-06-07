// Dependencies
const router = require("express").Router();

// Models
const Class = require("../models/db/class");
const Messages = require("../models/db/messages");
const Notifications = require("../models/db/notifications");

// Helpers
const arrayFlat = require("../helpers/arrayFlat");

// Data validation
const { classSchema } = require("../models/schemas");
const validation = require("../middleware/dataValidation");

router
    .route("/")
    .get(async (req, res) => {
        /**
         * Get all Classes
         *
         * @function
         * @param {Object} req - The Express request object
         * @param {Object} res - The Express response object
         * @returns {Object} - The Express response object
         */

            // Get all Classes from the database
        const classes = await Class.get();

        // Return the found Class Members to client
        return res.status(200).json({ classes });
    })
    .post(validation(classSchema), async (req, res) => {
        /**
         * Validate the request body against our Classes schema and then Create
         * a new Class Object
         *
         * @function
         * @param {Object} req - The Express request object
         * @param {Object} req.body - The request body, which represents a new Class Member
         * @param {Object} res - The Express response object
         * @returns {Object} - The Express response object
         */

            // Add the new Class to the database
        const newClass = await Class.add(req.body);

        // Return the newly created Class to the client
        return res.status(201).json({ newClass });
    });

router
    .route("/:id")
    .get(async (req, res) => {
        /**
         * Get a specific Class Object by their ID
         *
         * @function
         * @param {Object} req - The Express request object
         * @param {Object} res - The Express response object
         * @returns {Object} - The Express response object
         */
            // Destructure the ID off of the request parameters
        const { id } = req.params;

        // Destructure the authenticated User email off of res.locals
        // const { email } = res.locals.user;

        // Get the Class by ID
        const classById = await Class.find({
            "c.id": id,
        }).first();

        // If teamMember is falsy, we can assume that Class doesn't exist
        if (!classById) {
            return res.status(404).json({
                message: "Sorry, but we couldn't find that class member!"
            });
        }

        // Return the Class to the client
        return res.status(200).json({ classById });
    })
    .patch(validation(classSchema), async (req, res) => {
        /**
         * Validate the request body against the Class schema, then update
         * the specified Class in the database
         *
         * @function
         * @param {Object} req - The Express request object
         * @param {Object} req.body - The request body, which represents the changes we need to make to a specific Team Member
         * @param {Object} res - The Express response object
         * @returns {Object} - The Express response object
         */

            // Destructure the ID off the request parameters
        const { id } = req.params;

        // Update the specific Class instance in the database
        const updatedClass = await Class.update(
            { "c.id": id },
            req.body
        );

        // Return the updated Class instance to the client
        return res.status(200).json({ updatedClass });
    })
    .delete(async (req, res) => {
        /**
         * Delete a specified Class by ID
         *
         * @function
         * @param {Object} req - The Express request object
         * @param {Object} res - The Express response object
         * @returns {Object} - The Express response object
         */
            // Destructure the ID off of the request object
        const { id } = req.params;

        // Attempt to delete the specified Class from the database
        const deleted = await Class.remove({ "c.id": id });

        // If deleted is falsy, we can assume that there is no Class at that ID
        if (!deleted) {
            return res.status(404).json({
                message: "The resource could not be found."
            });
        }

        // Respond to the client with a success message
        return res.status(200).json({
            message: "The resource has been deleted."
        });
    });

router.delete("/:id/unassign/:ts_id", async (req, res) => {
    /**
     * "Unassign" a specific Class Member from a specific Training Series.
     * Ultimately, this deletes all pending notifications for that Class Member
     * that are associated with a particular Training Series.
     *
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */

        // Destructure the Team Member ID and Training Series ID off of the request object
    const { id, ts_id } = req.params;

    // Find all Messages associated with the specified Training Series
    const messages = await Messages.find({
        "ts.id": ts_id
    });

    // If messages.length is falsey, we can assume that that Team Member hasn't
    // been assigned to that training series.
    if (!messages.length) {
        return res.status(404).json({
            message:
                "This Class Member doesn't have any messages for that Training Series."
        });
    }

    // Compile a list of all pending Notifications associated with a Training
    // Series for that Team Member, based on the messages found above. This will
    // be an array of Promises
    const pNotifs = messages.map(
        async m =>
            await Notifications.find({
                "m.id": m.id,
                "tm.id": id
            })
    );

    // Resolve all Promises in that array
    const rNotifs = await Promise.all(pNotifs);

    // Flatten all nested arrays inside of rNotifs
    const notifsToDelete = arrayFlat(rNotifs);

    // Delete each notification and send back total number of deleted items,
    // along with array of deleted ids to send to the client
    const totalDeleted = notifsToDelete.map(
        async n => await Notifications.remove({ "n.id": n.id })
    );

    // If totalDeleted.length is falsey, we can assume that there were no pending
    // Notifications for that Team Member associated with that Training Series
    if (!totalDeleted.length) {
        return res.status(404).json({
            message:
                "This Class Member doesn't have any Notifications for that Training Series."
        });
    }

    // Respond to the client with the number of resources deleted and the ID's of
    // the deleted notifications
    return res.status(200).json({
        message: `${totalDeleted.length} resource(s) deleted.`,
        ids: notifsToDelete.map(n => n.id)
    });
});

module.exports = router;
