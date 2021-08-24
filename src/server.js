const express = require("express");
const cors = require("cors"); 
const app = express();


app.use(cors()); 

app.set("port", process.env.PORT || 3000);

module.exports = app;