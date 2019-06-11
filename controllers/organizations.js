// Dependencies
const router = require("express").Router();

// Models
const Organizations = require("../models/db/organizations");

const arrayFlat = require("../helpers/arrayFlat");

// Data validation
const { organizationsSchema } = require("../models/schemas");
const validation = require("../middleware/dataValidation");

router
    .route("/")
    .get(async (req, res) => {
        /**
         * Get all Team Members associated with an authenticated user
         *
         * @function
         * @param {Object} req - The Express request object
         * @param {Object} res - The Express response object
         * @returns {Object} - The Express response object
         */

        // Get all Team Members from the database that are associated with the authenticated User
        const organizations = await Organizations.get();

        // Return the found Team Members to client
        return res.status(200).json({ organizations });
    })
    .post(validation(organizationsSchema), async (req, res) => {
        /**
         * Validate the request body against Organization schema and then Create
         * a new Organization
         *
         * @function
         * @param {Object} req - The Express request object
         * @param {Object} req.body - The request body, which represents a new Organization
         * @param {Object} res - The Express response object
         * @returns {Object} - The Express response object
         */
        const { id } = res.locals.user;
            // Add the new Organization to the database
        if(user.is_admin){
            const newOrganization = await Organizations.add({...req.body, user_id: id});

            // Return the newly created Organization to the client
            return res.status(201).json({ newOrganization });
        }else{
            return res.status(401).json({error: "User does not have a permission to create organization"});
        }
    });

router
    .route("/:id")
    .get(async (req, res) => {
        /**
         * Get a specific Organizations by their ID
         *
         * @function
         * @param {Object} req - The Express request object
         * @param {Object} res - The Express response object
         * @returns {Object} - The Express response object
         */

            // Destructure the ID off of the request parameters
        const { id } = req.params;


        // Get the Organization by ID
        const organization = await Organizations.find({
            "m.id": id,
        }).first();

        // If teamMember is falsy, we can assume that Organization doesn't exist
        if (!organization) {
            return res.status(404).json({
                message: "Sorry, but we couldn't find that organization!"
            });
        }

        // Return the Team Member to the client
        return res.status(200).json({ organization });
    })
    .patch(validation(organizationsSchema), async (req, res) => {
        /**
         * Validate the request body against the Organization schema, then update
         * the specified instance in the database
         *
         * @function
         * @param {Object} req - The Express request object
         * @param {Object} req.body - The request body, which represents the changes we need to make to a specific Team Member
         * @param {Object} res - The Express response object
         * @returns {Object} - The Express response object
         */

            // Destructure the ID off the request parameters
        const { id } = req.params;

        // Update the specific organization in the database
        const updatedOrganization = await Organizations.update(
            { "m.id": id },
            req.body
        );

        // Return the updated instance to the client
        return res.status(200).json({ updatedOrganization });
    })
    .delete(async (req, res) => {
        /**
         * Delete a specified Organization
         *
         * @function
         * @param {Object} req - The Express request object
         * @param {Object} res - The Express response object
         * @returns {Object} - The Express response object
         */

            // Destructure the ID off of the request object
        const { id } = req.params;

        // Attempt to delete the specified Organization from the database
        const deleted = await Organizations.remove({ "m.id": id });

        // If deleted is falsy, we can assume that there is no instance by that ID
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
     * TODO "Unassign" a specific Admin from a specific Organization.
     *
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */
    //
    //     // Destructure the Team Member ID and Training Series ID off of the request object
    // const { id, ts_id } = req.params;
    //
    // // Find all Messages associated with the specified Training Series
    // const messages = await Messages.find({
    //     "ts.id": ts_id
    // });
    //
    // // If messages.length is falsey, we can assume that that Team Member hasn't
    // // been assigned to that training series.
    // if (!messages.length) {
    //     return res.status(404).json({
    //         message:
    //             "This Team Member doesn't have any messages for that Training Series."
    //     });
    // }
    //
    // // Compile a list of all pending Notifications associated with a Training
    // // Series for that Team Member, based on the messages found above. This will
    // // be an array of Promises
    // const pNotifs = messages.map(
    //     async m =>
    //         await Notifications.find({
    //             "m.id": m.id,
    //             "tm.id": id
    //         })
    // );
    //
    // // Resolve all Promises in that array
    // const rNotifs = await Promise.all(pNotifs);
    //
    // // Flatten all nested arrays inside of rNotifs
    // const notifsToDelete = arrayFlat(rNotifs);
    //
    // // Delete each notification and send back total number of deleted items,
    // // along with array of deleted ids to send to the client
    // const totalDeleted = notifsToDelete.map(
    //     async n => await Notifications.remove({ "n.id": n.id })
    // );
    //
    // // If totalDeleted.length is falsey, we can assume that there were no pending
    // // Notifications for that Team Member associated with that Training Series
    // if (!totalDeleted.length) {
    //     return res.status(404).json({
    //         message:
    //             "This Team Member doesn't have any Notifications for that Training Series."
    //     });
    // }
    //
    // // Respond to the client with the number of resources deleted and the ID's of
    // // the deleted notifications
    // return res.status(200).json({
    //     message: `${totalDeleted.length} resource(s) deleted.`,
    //     ids: notifsToDelete.map(n => n.id)
    // });
});

module.exports = router;
