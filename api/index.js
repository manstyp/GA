// ALWAYS RUN WHILE BUILDING --> npx tailwindcss -i ./style/style.css -o ./public/output.css --watch
const mongoose = require("mongoose");
const morgan = require("morgan");
const express = require("express");
const app = express();
const port = 3002;
const path = require("path");
const viewsDirectory = path.join(process.cwd(), "views");

app.use(morgan("dev"));
app.use(express.static("public"));
app.set("views", viewsDirectory);
app.set("view engine", "pug");

const database = "scores";
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster.5snl1t7.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(uri);
mongoose.connection
  .on("open", () => {
    console.log("Mongoose is connected :D");
  })
  .on("closed", () => {
    console.log("Mongoose is NOT connected :(");
  })
  .on("error", (error) => {
    console.log("Error", error);
  });

app.listen(port, () => {
  console.log("Server started on port " + port);
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
