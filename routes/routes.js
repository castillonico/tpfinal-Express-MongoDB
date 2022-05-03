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

router.get("/users", verifyUser, async (req, res) => {
  try {
    const arrayUsersDB = await User.find({});
    console.log("La cantidad de usuarios que enviarmos es: ", arrayUsersDB.length);
    const listToSend = arrayUsersDB.map(e => { 
      return { 
        _id: e._id,
        name: e.name, 
        lastName: e.lastName,
        email: e.email,
        active: e.active
      }
    });
    console.log (listToSend); 
    res.send(listToSend); 
  } catch (error) {
    console.log(error);
  }
})

function verifyUser(req, res, next) {
  if (!req.headers['token']) {
    res.status(400).send({ message: 'No hay un token en el req ' })
  } else {
    jwt.verify(req.headers['token'], "secret", (err) => {
      if (err) {
        console.log("error", err);
        res.status(400).send({ message: "token no válido " })
      } else {
        next()
      }
    })
  }
}; 

router.get("/user/:_id", verifyUser, async (req, res) => {
  const id = req.params;
  try {
    const user = await User.findOne(id); 
    re.status(200).send(user); 
  } catch (error) { 
    console.log("algo pasó con el pedido del usuario")
  }
}); 

router.delete("/user/:_id", verifyUser, async (req, res) => {
  const id = req.params;
  try {
    const user = await User.findOne(id);
    if (user) {
      console.log("usuario a borrar: ", user);
      await User.deleteOne(id);
      res.status(204).send({ message: "el usuario fué eliminado correctamente"});
    } else {
      res.status(409).send("el usuario indicado no existe")
    }
  } catch (error) {
    res.status(400).send({ message: "no se pudo eliminar el usuario requerido" });
    console.log(error);
  }
});

router.put("/user/:_id", async (req, res) => { 
  const id = req.params;
  try {
    const user = await User.findOne(id);
    if (user) {
      await User.deleteOne(id);
      res.status(204).send("se ha modificado el usuario");
    } else {
      res.status(409).send("el usuario indicado no existe")
    }
  } catch (error) {
    res.status(400).send({ message: "no se pudo actualizar el usuario requerido" });
    console.log(error);
  }
})

router.post("/user", async (req, res) => {
  const body = req.body;
  const pass = body.password;
  let passHashed = await bcrypt.hash(pass, 8);
  body.password = passHashed;
  console.log(body);
  try {
    const userDB = new User(body);
    await userDB.save();
    console.log("el nombre de usuario es: ", body.name);
    res.status(201).send({ message: "usuario Creado!" });
  } catch (error) {
    res.status(400).send({ message: "el usuario no se pudo crear" });
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
    return res.status(401).send({ message: "el usuario que intenta ingresar no existe" });
  } else {
    console.log("el usuario es: ", user);
    bcrypt.compare(password, user.password, (err, sonIguales) => {
      if (err) {
        console.log("por lo visto, salió un error ")
        res.status(401).send({ error: err })
      } else
        if (!sonIguales) {
          console.log("El pass no es correcto");
          res.status(401).send({ message: "El pass es incorrecto" })
        } else {
          console.log("el usuario puede ingresar");
          jwt.sign({ user: user }, "secret", (err, token) => {
            if (err) {
              console.log(err);
              res.status(400).send({ message: "se produjo un error al crear el token" })
            } else {
              res.status(200).send({ token: token })
            }
          })
        }
    })
  }
});

module.exports = router;
