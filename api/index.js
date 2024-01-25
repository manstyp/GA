// ALWAYS RUN WHILE BUILDING --> npx tailwindcss -i ./style/style.css -o ./public/output.css --watch
const mongoose = require("mongoose");
const morgan = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3003;
const path = require("path");
const viewsDirectory = path.join(process.cwd(), "views");
const User = require("./models/user");
const bcrypt = require("bcrypt");

app.use(morgan("dev"));
app.use(express.static("public"));
app.set("views", viewsDirectory);
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster.5snl1t7.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(uri).then(
  (client) => {
    console.log("Mongoose is connected :D");
  },
  (reason) => {
    console.log(`Failed due to ${reason}`);
  }
);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

//routes
app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/game", (req, res) => {
  res.render("game");
});

app.post("/authenticate-register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("Username is already taken");
    }

    const newUser = new User({ username, password });

    await newUser.save();

    res.status(201).send("User registered successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/authenticate-login", (req, res) => {
  const { username, password } = req.body;
});

app.get("*", (req, res) => {
  res.send("Route error");
});
