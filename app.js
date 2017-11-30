var express = require('express');
var app = express();
var server = app.listen(90);
var io = require('socket.io').listen(server);

var todolist = [];

// On affiche la todolist et le formulaire
app.get('/todo', function(req, res) { 
    res.render('todo.ejs');
})
.use(function(req, res, next){
    res.redirect('/todo');
});

// On gère les échanges avec socket.io
io.sockets.on('connection', function (socket) {
    // Lorsqu'un client se connecte, on lui envoie la liste
    socket.emit('miseajour', todolist);

    // On reçoit un nouvel élément à ajouter
    socket.on('ajouter', function (nomTodo) {
        // On met à jour la todolist sur le serveur
        todolist.push(nomTodo);

        // On envoie la nouvelle todolist tout le monde
        // io.sockets.emit envoie à *tout le monde* (broadcast n'aurait pas envoyé à l'émetteur d'origine)
        io.sockets.emit('miseajour', todolist);
    });

    socket.on('supprimer', function (indexTodo) {
        // On supprime l'élément sur la todolist du serveur
        todolist.splice(indexTodo, 1);

        // Mise à jour pour tout le monde
        io.sockets.emit('miseajour', todolist);
    });
});
 