const express = require("express");
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.render("index.ejs")
});

app.get("/shawarma-gallery", (req, res) => {
  res.render("shawarma-gallery.ejs")
});
app.get("/ice-cream-gallery", (req, res) => {
  res.render("ice-cream-gallery.ejs")
});
app.get("/certification", (req, res) => {
  res.render("certification.ejs")
});
app.get("/smoothie-gallery", (req, res) => {
  res.render("smoothie-gallery.ejs")
});
app.get("/pop-corn-gallery", (req, res) => {
  res.render("pop-corn-gallery")
});
app.get("/zobo-gallery", (req, res) => {
  res.render("zobo-gallery.ejs")
});
app.get("/tiger-nut-gallery", (req, res) => {
  res.render("tiger-nut-gallery")
});
app.get("/roasted-fish-gallery", (req, res) => {
  res.render("roasted-fish-gallery")
});
app.get("/Sesame-gallery", (req, res) => {
  res.render("Sesame-gallery")
})
let port = 3000;
app.listen(port, ()=> console.log(`server running on ${port}`))