const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const parser = require("body-parser");
require("../src/connectDB");
const User = require("../src/models/User");
const jwt = require('jsonwebtoken');
const cors = require('cors'); 

router.use(cors()); 
router.use(parser.urlencoded({ extended: false }));
router.use(parser.json());

router.get('/', function (req, res, next) {
  console.log("Se accedio al path / ");
  res.send('respond with a resource');
});

router.get("/users", verifyUser, async (req, res) => {
  try {
    const arrayUsersDB = await User.find({});
    console.log("La cantidad de usuarios que enviarmos es: ", arrayUsersDB.length);
    res.send(arrayUsersDB)
  } catch (error) {
    console.log(error);
  }
})

function verifyUser(req, res, next) {
  if (!req.headers['token']) {
    res.status(400).send({message: 'No hay un token en el req '})
  } else {
    jwt.verify(req.headers['token'], "secret", (err) => {
      if (err) {
        console.log("error", err);
        res.status(400).send({message: "token no válido "})
      } else {
        next()
      }
    })
  }
}

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
    res.status(201).send({message: "usuario Creado!"});
  } catch (error) {
    res.status(400).send({message: "el usuario no se pudo crear"});
    console.log(error);
  }
});

router.post("/login", async (req, res) => { 
  console.log(req.body);
  const email = req.body.email;  
  const password = req.body.password;
  const user = await User.findOne({ email });
  if (!user) {
    console.log("el usuario que intenta ingresar no existe");
    return res.status(401).send({message: "el usuario que intenta ingresar no existe"});
  } else {
    console.log("el usuario es: ", user);
    bcrypt.compare(password, user.password, (err, sonIguales) => {
      if (err) {
        console.log("por lo visto, salió un error ")
        res.status(401).send({error: err})
      } else
        if (!sonIguales) {
          console.log("El pass no es correcto");
          res.status(401).send({message: "El pass es incorrecto"})
        } else {
          console.log("el usuario puede ingresar");
          jwt.sign({ user: user }, "secret", (err, token) => {
            if (err) {
              console.log(err);
              res.status(400).send({message: "se produjo un error al crear el token"})
            } else {
              res.status(200).send({token: token})
            }
          })
        }
    })
  }
});

module.exports = router;
