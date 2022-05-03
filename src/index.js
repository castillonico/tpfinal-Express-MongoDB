const app = require("./server");
const routes = require("../routes/routes");

app.use(routes);


app.listen(app.get("port"), () => {
    console.log("Servidor en linea".bgMagenta, app.get("port"));
});

//un nuevo comentarios

