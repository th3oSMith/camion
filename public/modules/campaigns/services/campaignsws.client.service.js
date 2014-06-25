'use strict';

angular.module('campaigns').factory('Campaignsws', 
	function(socketFactory) {
		var myIoSocket = io.connect('/ws');

		var mySocket = socketFactory({
			ioSocket: myIoSocket
		});

		return mySocket;
	}
);