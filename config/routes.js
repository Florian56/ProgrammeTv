/**
 * Routes rules
 * @doc http://sailsjs.org/documentation/concepts/routes
 */

module.exports.routes = {
	'programmetv/indexProgrammes': 'ProgrammeTvController.indexProgrammes',
	'programmetv/indexChaines': 'ProgrammeTvController.indexChaines',
	'programmetv/updateAffichage': 'ProgrammeTvController.updateAffichage',
	'programmetv/ecouterDescriptifProgramme': 'ProgrammeTvController.ecouterDescriptifProgramme',
	'programmetv/ecouterListeProgrammes': 'ProgrammeTvController.ecouterListeProgrammes'
};