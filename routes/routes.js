const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const parser = require("body-parser");
require("../src/connectDB");
const User = require("../src/models/User");
const jwt = require('jsonwebtoken'); 

router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


router.use(parser.urlencoded({ extended: false }));
router.use(parser.json());

router.get('/', function (req, res, next) {
  console.log("Se accedio al path / ");
  res.send('respond with a resource');
});

router.get("/users", async (req, res) => {
  try {
    const arrayUsersDB = await User.find({});
    console.log(arrayUsersDB);
    res.send(arrayUsersDB)
  } catch (error) {
    console.log(error);
  };
});

router.post("/users", async (req, res) => {
  const body = req.body;
  const pass = body.password;
  let passHashed = await bcrypt.hash(pass, 8);
  body.password = passHashed;
  console.log(body);
  try {
    const userDB = new User(body);
    await userDB.save();
    console.log("el nombre de usuario es: ", body.name);
    res.status(201).send("usuario Creado!");
  } catch (error) {
    res.status(400).send("el usuario no se pudo crear");
    console.log(error);
  }
});

router.post("/user", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    console.log("el usuario que intenta ingresar no existe"); 
    return res.status(401).send("no existe el email");
  } else {
    console.log("el siguiente usuario quiere ingresar"); 
    console.log("el usuario es: ", user);
    bcrypt.compare(password, user.password, (err, sonIguales) => {
      if (err) { 
        console.log("por lo visto, salió un error ")
        res.status(401).send(err)
      } else {
        console.log("parece que salió todo demasiado bien"); 
        jwt.sing({user: user}, "secret", (err, token) => { 
          res.status(200).send(token)
      })}
  })}
});
  

module.exports = router;
