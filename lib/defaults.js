
var param = require('./parametres.js');

module.exports.programmetv = {

  // title for the Hook
  title: 'ProgrammeTV',
	// the name of the hook folder
  folderName: param.folderName,

  actionTypes : [
    {
      serviceName: 'ProgrammeTvService',
      functionName: 'AjoutProgramme',
      name: 'Say (Voicerss)',
      description: 'Say the given text (Voicerss)',
      optionspath: ''
    }
  ]

};