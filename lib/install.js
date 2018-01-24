var config = require('./config.js').config;

module.exports = function() {
	return gladys.param.setValue({name : config.nomParametreChainesExclues, value : 'Chaine1,Chaine2,...'});
};