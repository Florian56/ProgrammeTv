var Promise = require('bluebird');
var request = require('./request.js');
var parseData = require('./parseData.js');

module.exports = function() {
	return request()
		.then(xml => parseData(xml))
		.catch(error => Promise.reject(error));
};