var express = require('express');
var mongodb = require('mongodb'); //127.0.0.1:27017
var ObjectId = require('mongodb').ObjectID;
var bodyParser = require('body-parser');

var app = express();

app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: true }));

var dbUrl = 'mongodb://localhost:27017/gestion';

app.get('/', function(req, res) {

    /*let datos = {
        usuarios: [{
                nombre: "Pepe",
                apellido: "Peréz",
                edad: 25,
                pais: "Polonia"
            },
            {
                nombre: "Maria",
                apellido: "Gómez",
                edad: 26,
                pais: "Francia"
            }
        ]
    };
    res.render('index', datos);
    */

    mongodb.connect(dbUrl, function(err, db) {
        let datos = {};
        db.collection('usuarios').find().toArray(function(err, docs) {
            datos.usuarios = docs;
            res.render('index', datos);
        })
    });
});

app.get('/formulario', function(req, res) {

    res.render('formulario');
});

app.post('/insertaUsuario', function(req, res) {
    mongodb.connect(dbUrl, function(err, db) {
        datos = {};

        let usuario = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            edad: req.body.edad,
            pais: req.body.pais
        };
        datos.usuario = usuario;
        db.collection('usuarios').insert(usuario);
        //res.render('insertaUsuario', datos);
        res.redirect("/");
    });
});

app.get('/remove', function(req, res) {
    mongodb.connect(dbUrl, function(err, db) {
        let datos = {};
        var id = req.query.id;

        db.collection('usuarios').remove({ _id: ObjectId(id) }, function(err, docs) {});

        db.collection('usuarios').find().toArray(function(err, docs) {
            datos.usuarios = docs;
            res.render('index', datos);
        })
    });
});

app.listen(8000, function() {
    console.log('Servidor escuchando http://localhost:8000');
});

//Recibe el id del usuario a modificar y carga sus datos en un formulario
app.get('/modificar', function(req, res) {

    var id = req.query.id;

    mongodb.connect(dbUrl, function(err, db) {
        db.collection('usuarios').find({ "_id": new ObjectId(id) }).toArray(function(fff, doc) {
            datos = {};
            let usuario = {
                _id: doc[0]._id,
                nombre: doc[0].nombre,
                apellido: doc[0].apellido,
                edad: doc[0].edad,
                pais: doc[0].pais
            }
            datos.usuario = usuario;
            res.render('modificarUsuario', datos);
        });
    });
});

//Modificación: Recibe los datos del usuario a modificar y lo modifica
app.post('/modificando', function(req, res) {
    let usuario = {
        _id: req.body._id,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        edad: req.body.edad,
        pais: req.body.pais
    }
    mongodb.connect(dbUrl, function(err, db) {
        //Update
        db.collection('usuarios').update({ "_id": new ObjectId(usuario._id) }, { $set: { nombre: usuario.nombre, apellido: usuario.apellido, edad: usuario.edad, pais: usuario.pais } });
    });
    res.redirect("/");
});