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
const bcrypt = require("bcryptjs");

app.use(morgan("dev"));
app.use(express.static("public"));
app.set("views", viewsDirectory);
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: true }));

const uri = process.env.MONGODB_URI;

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });

    await newUser.save();

    res.status(201).redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/authenticate-login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      res.send("Login successful");
    } else {
      res.status(201).redirect("/game");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("*", (req, res) => {
  res.send("Route error");
});
