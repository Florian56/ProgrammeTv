var Promise = require('bluebird');
var request = require('request');
var config = require('./config.js').config;

module.exports = function() {
	return new Promise((resolve, reject) => {
		var dateDuJour = ObtenirDateDuJour();
		var url = `${config.url}${dateDuJour}.xml`;

		request({url : url}, (err, res, body) => {
			if(err) {
				return reject(err);
			}
			
			if(res.statusCode !== 200) {
				return reject(new Error(`Status code failed : ${res.statusCode}`));
			}
			
			return resolve(body);
		});
	});
};

function ObtenirDateDuJour() {
	var date = new Date();
	var year = date.getFullYear();
	var month = ForcerDeuxDigits(date.getMonth() + 1);
	var day = ForcerDeuxDigits(date.getDate());
	
	return day + '-' + month + '-' + year;
}

function ForcerDeuxDigits(nb) {
	return (nb < 10) ? ('0' + nb) : nb;
}