//Dependencies
const express = require("express"),
  helmet = require("helmet"),
  cors = require("cors");

//Server to point to
const server = express();

//Library Middleware
server.use(helmet(), express.json(), cors());

// twilio notification system import
const notificationSystem = require("./twilio/startSystem");

//Routes
const usersRouter = require("./routes/userRouter");
const teamsRouter = require("./routes/teamMemberRouter");
const seedRouter = require("./routes/seedRouter");
const authRouter = require("./routes/authRoutes");

//API Endpoints
server.use("/api/seed", seedRouter);
server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);
server.use("/api/team-members", teamsRouter);

//Default Endpoints
server.get("/", (req, res) => {
  res.send("It works!");
});

// notificationSystem.start();

module.exports = server;
