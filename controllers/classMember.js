// Dependencies
const router = require("express").Router();

// Models
const ClassMember = require("../models/db/classMembers");
const Messages = require("../models/db/messages");
const Notifications = require("../models/db/notifications");

// Helpers
const arrayFlat = require("../helpers/arrayFlat");

// Data validation
const { classMemberSchema } = require("../models/schemas");
const validation = require("../middleware/dataValidation");

router
  .route("/")
  .get(async (req, res) => {
    /**
     * Get all Class Members
     *
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */

    // Get all Class Members from the database that are associated with the authenticated User
    const classMembers = await ClassMember.get();

    // Return the found Class Members to client
    return res.status(200).json({ classMembers });
  })
  .post(validation(classMemberSchema), async (req, res) => {
    /**
     * Validate the request body against our Class Member schema and then Create
     * a new Class Member
     *
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} req.body - The request body, which represents a new Class Member
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */

    // Add the new Class Member to the database
    const newClassMember = await ClassMember.add(req.body);

    // Return the newly created Class Member to the client
    return res.status(201).json({ newClassMember });
  });

router
  .route("/:id")
  .get(async (req, res) => {
    /**
     * Get a specific Class Member by their ID
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

    // Get the Class Member associated with a user by ID
    const classMember = await ClassMember.find({
      "cm.id": id,
    }).first();

    // If teamMember is falsy, we can assume that Class Member doesn't exist
    if (!classMember) {
      return res.status(404).json({
        message: "Sorry, but we couldn't find that class member!"
      });
    }

    // Return the Team Member to the client
    return res.status(200).json({ classMember });
  })
  .patch(validation(classMemberSchema), async (req, res) => {
    /**
     * Validate the request body against the Class Member schema, then update
     * the specified Class Member in the database
     *
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} req.body - The request body, which represents the changes we need to make to a specific Team Member
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */

    // Destructure the ID off the request parameters
    const { id } = req.params;

    // Update the specific Class member in the database
    const updatedClassMember = await ClassMember.update(
      { "cm.id": id },
      req.body
    );

    // Return the updated Team Member to the client
    return res.status(200).json({ updatedClassMember });
  })
  .delete(async (req, res) => {
    /**
     * Delete a specified Class Member
     *
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */

    // Destructure the ID off of the request object
    const { id } = req.params;

    // Attempt to delete the specified Class Member from the database
    const deleted = await ClassMember.remove({ "cm.id": id });

    // If deleted is falsy, we can assume that there is no Class Member at that ID
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
