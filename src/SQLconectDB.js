const cnx = require("mysql"); 

const conexion = cnx.createConnection ({
    host: "localhost", 
    user: "root", 
    password: "pass", 
    database: "clubtenis"
}); 

const conectar = () => { 
    conexion.connect(error => {
        if (error) throw error
        console.log ("BBDD Conectada! Ahora");
    }, "single") 
} 

module.exports = {
    conectar:conectar 
}