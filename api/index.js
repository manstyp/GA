// ALWAYS RUN WHILE BUILDING --> npx tailwindcss -i ./style/style.css -o ./public/output.css --watch

const express = require("express");
const app = express();
const port = 3002;
const path = require("path");
const viewsDirectory = path.join(process.cwd(), "views");

app.use(express.static("public"));

app.set("views", viewsDirectory);
app.set("view engine", "pug");

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
