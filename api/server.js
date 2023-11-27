const express = require("express");
const app = express();
const port = 3001;
const path = require("path");

const viewsDirectory = path.join(__dirname, "../views");
console.log("Views directory:", viewsDirectory);
app.set("views", viewsDirectory);
app.set("view engine", "pug");

app.listen(port, () => {
  console.log("Server started on port " + port);
});

//routes
app.get("/", (req, res) => {
  res.render("index");
});
