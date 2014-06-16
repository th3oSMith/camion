'use strict';

var paps;
var io;

module.exports.getIO = function() {return io;};

module.exports.start = function(ioSocket){

    io = ioSocket;
    paps = io.on('connection', function(socket){
        console.log('user connected !!!');

        socket.on('subscribe', function (data){
            socket.join(data.paps);
        });
    });

};