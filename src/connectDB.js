const mongoose = require("mongoose");

const dbUser = "dbUserFullStack";
const dbPass = "root";
const ddbb = "CursoFullStack"
const uri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.g2umm.mongodb.net/${ddbb}?retryWrites=true&w=majority`;


mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log("BBDD Conectada! ".black.bgGreen))
    .catch(error => console.log(error));