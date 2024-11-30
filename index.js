require("dotenv/config");
const express = require("express");
const http = require("http");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");

const app = express();
const server = http.createServer(app);

const { connectToDatabase } = require("./database/coffee-db-connection");

const userRouter = require("./allRoutes/userRouter");

app.use(
  cors({
    origin: ["http://localhost:3000"], // Only allow requests from localhost:3000
    credentials: true,
  })
);
app.options("*", cors());

app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    },
  })
);

// Use your routers here
app.use("/", userRouter);

connectToDatabase(() => {
  console.log("Successfully connected to database");

  // Listen only on localhost for local development
  server.listen(3001, "localhost", () => {
    console.log(`Server is running on localhost:3001`);
  });
});
