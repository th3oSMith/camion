'use strict';

var paps;
var io;
var connected = {};

module.exports.getIO = function() {return io;};

module.exports.start = function(ioSocket){

    io = ioSocket;
    paps = io.on('connection', function(socket){
        var room;

        console.log('user connected !!!');

        socket.on('subscribe', function (data){
            socket.join(data.paps);
            room = data.paps;
            console.log('Entrée dans la room '+room);
            
            if (!connected[room])
                connected[room] = 1;
            else
                connected[room]++;

            io.sockets.in(room).emit('population', {population: connected[room]});
            console.log(connected[room]);

        });

        socket.on('unsubscribe', function (){
            socket.leave(room);
            console.log('Sortie de la room '+room);
            connected[room]--;

            io.sockets.in(room).emit('population', {population: connected[room]});
            room = null;

        });

        socket.on('disconnect', function () {
            
            connected[room]--;
            io.sockets.in(room).emit('population', {population: connected[room]});
            console.log('Client déconnecté');
        });

    });

};