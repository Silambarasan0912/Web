require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
const port = 3000;

console.log(process.env.SECRET);

app.set(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

var secret = process.env.SECRET;
userSchema.plugin(encrypt, {
  secret: secret,
  encryptedFields: ["password"],
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/register", (req, res) => {
  const user1 = new User({
    email: req.body.usermail,
    password: req.body.password,
  });
  insertUsers();
  res.render("secrets");

  function insertUsers() {
    try {
      const response = user1.save();
      if (response) {
        res.render("secret s");
      }
    } catch (err) {
      console.log(err);
    }
  }
});

app.post("/login", (req, res) => {
  const usermail = req.body.usermail;
  const password = req.body.password;

  validateLogin();

  async function validateLogin() {
    try {
      const founduser = await User.findOne({ email: usermail });
      // console.log(founduser);
      if (founduser && founduser.password === password) {
        res.render("secrets");
      } else {
        console.log("Incorrect password or user not found");
      }
    } catch (error) {
      console.error(error);
    }
  }
});

app.listen({ port }, () => {
  console.log("server started at port 3000");
});
