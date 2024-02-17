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
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));
app.set("views", viewsDirectory);
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
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

app.get("/home", async (req, res) => {
  if (!req.session.userId && process.env.ENVIRONMENT != "DEV") {
    res.render("index");
  } else {
    let userId, user;
    if (process.env.ENVIRONMENT == "DEV") {
      userId = 0;
      user = {
        username: "Admin",
      };
    } else {
      userId = req.session.userId;
      user = await User.findById(userId);
    }

    res.render("indexLoggedIn", {
      username: user.username,
    });
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/play", (req, res) => {
  if (!req.session.userId && process.env.ENVIRONMENT != "DEV") {
    res.redirect("home");
  } else {
    res.redirect("/game/");
  }
});

//app.get("/game", (req, res) => {
//  res.redirect("/game/");
//});

app.get("/profile/:username", requireLogin, async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("profile", { username: user.username });
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
    if (username.length >= 15) {
      return res.status(400).send("Maximum 14 characters");
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
      res.status(201).redirect("/home");
    } else {
      res.status(401).send("Invalid password");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }

  req.session.username = username;
});

app.get("/kill-session", (req, res) => {
  req.session.destroy();
  res.redirect("/home");
});

app.get("/switch-account", (req, res) => {
  req.session.destroy();
  res.redirect("login");
});

app.get("*", (req, res) => {
  res.redirect("/home");
});
