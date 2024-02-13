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
const session = require("express-session");

//MIDDLEWARE
app.use(morgan("dev"));
app.use(express.static("public"));
app.set("views", viewsDirectory);
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
};

//MONGOOSE CONNECTION
const uri = process.env.MONGODB_URI;
mongoose.connect(uri).then(
  (client) => {
    console.log("Mongoose is connected :D");
  },
  (reason) => {
    console.log(`Failed due to ${reason}`);
  }
);

//ROUTES
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

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

app.get("/play", (req, res) => {
  if (!req.session.userId) {
    res.redirect("home");
  } else {
    res.render("game");
  }
});

app.get("/profile/:username", requireLogin, async (req, res) => {
  try {
    const username = req.session.username;
    res.render("profile", { username });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
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

    req.session.userId = newUser._id;
    req.session.username = newUser.username;
    req.session.password = newUser.password;

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
      req.session.userId = user._id;
      res.status(201).redirect("/play");
    } else {
      res.status(401).send("Invalid password");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }

  req.session.user = username;
});

app.get("*", (req, res) => {
  res.send("Route error");
});
