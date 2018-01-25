var Promise = require('bluebird');
var xml2js = require('xml2js');
var async = require('async');
var config = require('./config.js').config;

module.exports = function(xml) {
	return gladys.param.getValue(config.nomParametreChainesExclues)
		.then(chainesExclues => {
			return new Promise((resolve, reject) => {
				var parser = new xml2js.Parser();
				parser.parseString(xml, (err, result) => {
					if (err) {
						reject("[ProgrammeTV] " + err);
					}
					
					var programmesTrouves = {};
					var programmes = result.rss.channel[0].item;
					
					async.eachSeries(
						programmes,
						(programme, callback) => {
							var title = JSON.stringify(programme.title).replace("[\"", "").replace("\"]", "").split(" | ");
							var chaine = title[0];
							var heureDebut = parseInt(title[1].split(":")[0]);
							var minutesDebut = parseInt(title[1].split(":")[1]);
							var nomProgramme = title[2];
							var category = programme.category;
							var description = programme.description;
								
							// Recherche uniquement des programmes de 20h45 à 21h20.
							if (chainesExclues.indexOf(chaine) == -1 &&
								((heureDebut == 20 && minutesDebut >= 45) || (heureDebut == 21 && minutesDebut <= 20))) {
								if (programmesTrouves.hasOwnProperty(chaine) &&
									(heureDebut > programmesTrouves[chaine].heureDebut ||
									minutesDebut > programmesTrouves[chaine].minutesDebut)) {
									
									programmesTrouves[chaine].heureDebut = heureDebut;
									programmesTrouves[chaine].minutesDebut = minutesDebut;
									programmesTrouves[chaine].nomProgramme = nomProgramme;
									programmesTrouves[chaine].typeProgramme = category;
									programmesTrouves[chaine].descriptif = description;
								}
								else {
									programmesTrouves[chaine] = {
										heureDebut : heureDebut,
										minutesDebut : minutesDebut,
										nomProgramme : nomProgramme,
										typeProgramme : category,
										descriptif : description
									};
								}
							}
							
							callback();
						},
						error => {
							if (error) {
								reject(error);
							}
							else {
								resolve(programmesTrouves);
							}
						}
					);
				});
			});
		});
};