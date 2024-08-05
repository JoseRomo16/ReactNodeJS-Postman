const express    = require('express');
const path       = require('path');
const bodyParser = require('body-parser'); // middleware de Node.js que se utiliza para analizar el cuerpo de las solicitudes HTTP entrantes.
const bcrypt     = require('bcrypt');
const mongoose   = require('mongoose');
const app        = express();
const User       = require('./Public/user');
//const {result}   = require('underscore');
const user = require('./Public/user');

const mongo_uri = 'mongodb://localhost:27017/drogueria';

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extends: false}));
app.use(express.static(path.join(__dirname, 'Public')));
//app.use(express.urlencoded({extended: false}));
 
//Ruta para registrar un nuevo usuario
app.post('/registrar', (req, res) => {
    console.log(req.body);
    const {usuario, password} = req.body
    const user = new User({usuario, password});
    user.save()
    .then(() => {
        res.send('Usuario guardado');
    })
    .catch((err) => {
        res.send("Error al registrar");
    });
});

//Ruta para buscar un usuario
app.post('/autenticar', async function (req, res) {
     const {usuario, password} = req.body
     console.log(req.body);
     const passUser = await user.findOne({usuario});
     if (passUser){
        res.send('El password es correcto');
     }else{
        res.send('El usuario no se encuentera registrado');
     }
});

//Ejecutamos la conexión a la base de datos Mongo
mongoose.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true } )
.then(() => console.log(`Conectado exitosamente a la BD ${mongo_uri}`))
.catch((err) => { console.error(err); });

//Cargamos el servidor para que escuche las peticiones
app.listen(3000, () => {
    console.log('La aplicación se encuentra en línea');
});

module.exports = app;