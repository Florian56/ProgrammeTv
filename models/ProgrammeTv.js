module.exports = {

	attributes : {
		chaine : {
			model : 'ProgrammeTvChaine',
			required : true
		},
		nomProgramme : {
			type : 'string',
			required : true
		},
		heureDebut : {
			type : 'string',
			required : true
		},
		typeProgramme : {
			type : 'string'
		},
		descriptif : {
			type : 'text'
		}
	}
};