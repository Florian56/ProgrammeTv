module.exports = {

	attributes : {
		nomChaine : {
			type : 'string',
			required : true
		},
		afficherDansDashboard : {
			type : 'boolean',
			defaultsTo : true,
			required : true
		},
		ordreAffichage : {
			type : 'integer',
			defaultsTo : 0
		}
	}
};