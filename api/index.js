const express = require("express");
const app = express();
const port = 3002;
const path = require("path");
const viewsDirectory = path.join(process.cwd(), "../views");

console.log(viewsDirectory);

app.set("views", viewsDirectory);
app.set("view engine", "pug");

app.listen(port, () => {
  console.log("Server started on port " + port);
});

//routes
app.get("/", (req, res) => {
  res.render("index");
});
