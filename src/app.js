const app = require("./server");
const routes = require("./routes/routes"); 
const morgan = require("morgan"); 
const cnx = require("./SQLconectDB"); 



//MIDDLEWARES: 
app.use(morgan("dev")); 
app.use("/", routes);


// CONEXIONES A BBDD Y SERVIDOR DISPONIBLE: 
cnx.conectar(); 

app.listen(app.get("port"), () => {
    console.log("Servidor en linea".bgMagenta, app.get("port"));
});

