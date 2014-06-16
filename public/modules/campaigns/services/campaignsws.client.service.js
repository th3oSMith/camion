'use strict';

angular.module('campaigns').factory('Campaignsws', 
	function(socketFactory) {
		var myIoSocket = io.connect('/');

		var mySocket = socketFactory({
			ioSocket: myIoSocket
		});

		return mySocket;
	}
);