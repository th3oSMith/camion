'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null
	});
};

exports.getTime = function (req, res) {
    res.jsonp({time: (new Date()).getTime()});
};