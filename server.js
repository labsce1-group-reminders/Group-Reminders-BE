//Dependencies
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

//Server to point to
const server = express();

//Library Middleware
server.use(helmet(), express.json(), cors());

// authentication, error and validation middleware
const { authentication } = require("./middleware/authentication");
const errorHandler = require("./middleware/errorHandling");

//Routes
const usersRouter = require("./controllers/user");
const organizationsRouter = require("./controllers/organizations");
const classMember = require("./controllers/classMember");
const classes = require("./controllers/classes");
const authRouter = require("./controllers/auth");
const trainingsRouter = require("./controllers/trainingSeries");
const messageRouter = require("./controllers/message");
const stripeRouter = require("./controllers/stripe");
const slackRouter = require("./controllers/slack");
const notificationsRouter = require("./controllers/notification");
const responsesRouter = require("./controllers/responses");
const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.yaml');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const options = {
  explorer: true
};

//API Endpoints
server.use("/api/auth", authRouter);
server.use("/api/users", authentication, usersRouter);
server.use("/api/organizations", authentication, organizationsRouter);
server.use("/api/class_member", authentication, classMember);
server.use("/api/classes", authentication, classes);
server.use("/api/training-series", authentication, trainingsRouter);
server.use("/api/messages", authentication, messageRouter);
server.use("/api/stripe", authentication, stripeRouter);
server.use("/api/slack", authentication, slackRouter);
server.use("/api/notifications", authentication, notificationsRouter);
server.use("/api/responses", responsesRouter);
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
server.get('/oauth2-redirect.html', function(req, res) {
  res.sendFile(__dirname + "/znode_modules/swagger-ui-dist/oauth2-redirect.html");
});
//Default Endpoints
server.get("/", (req, res) => {
  res.send("It works!");
});

//async error handling middleware MUST come after routes or else will just throw Type error
server.use(errorHandler);

module.exports = server;
