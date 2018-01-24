var config = require('./config.js').config;

module.exports = function() {
	return gladys.param.delete({name : config.nomParametreChainesExclues});
};