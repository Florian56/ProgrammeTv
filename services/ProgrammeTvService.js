var request = require('request');
xml2js = require('xml2js');
async = require('async');

/**
	Contient les chaines qui existent déjà dans la base de données
	Format : {NomChaine : TF1, IdChaine : 1}, {NomChaine : Arte, IdChaine : 2}, ...
*/
var chainesTvEnBase = [];

/**
	Contient les nouvelles chaines trouvées dans le XML et qui n'existent pas dans la base de données
	Format : [TF1, Arte, ...]
*/
var nouvellesChainesSansId = [];

/**
	Contient les nouvelles chaines trouvées dans le XML et qui sont créées maintenant en base de données
	Format : {NomChaine : TF1, IdChaine : 1}, {NomChaine : Arte, IdChaine : 2}, ...
*/
var nouvellesChainesAvecId = [];

/**
	Contient le programme le plus proche de 21h pour chaque chaine
	Format : {
		nomChaine : TF1,
		heureDebutHeure : 20,
		heureDebutMinutes : 55,
		nomProgramme : Koh Lanta,
		typeProgramme : Divertissement,
		descriptif : Petit descriptif
	},
	{nomChaine : Arte ...} ...
*/
var programmesParChaine = [];

/**
 * Vérifie la présence d'une valeur dans un tableau
 * @method contains
 * @param {} value
 * @return true or false
 */
Array.prototype.contains = function (value)
{
    return this.indexOf(value) > -1;
}

/**
 * Cherche dans le tableau l'id de la chaine (id en base de données)
 * @method getIdChaine
 * @param {} nomChaine
 * @return Index of nomChaine if exists. -1 otherwise.
 */
Array.prototype.getIdChaine = function (nomChaine)
{    
	var IdChaine = -1;
	for (var i = 0; i < this.length; i++)
	{
		if (this[i].NomChaine == nomChaine)
		{
			IdChaine = this[i].IdChaine;
			break;
		}
	}
	return IdChaine;
}

function replaceAll(str, find, replace)
{
	return str.replace(new RegExp(find, 'g'), replace);
}

/**
 * Nettoie les caractères spéciaux dans le nom d'une chaine TV
 * @method nettoieNomChaineTv
 * @param {} nomChaine
 * @return Nom de la chaine nettoyée
 */
function nettoieNomChaineTv(nomChaine)
{    
	var nomChaineModifiee = nomChaine;
	nomChaineModifiee = nomChaineModifiee.replace('+', ' pluss');
	nomChaineModifiee = replaceAll(nomChaineModifiee, 'é', 'e');
	nomChaineModifiee = replaceAll(nomChaineModifiee, 'è', 'e');
	nomChaineModifiee = replaceAll(nomChaineModifiee, '\'', '');
	nomChaineModifiee = replaceAll(nomChaineModifiee, 'î', 'i');
	nomChaineModifiee = replaceAll(nomChaineModifiee, 'Ô', 'O');
	
	return nomChaineModifiee;
}

/**
 * Parse le XML et enregistre en base de données les programmes du soir
 * @method getProgrammesTv
 */
function getProgrammesTv()
{
	var parser = new xml2js.Parser();
	var dateAujourdhui = getActualDate();
	var nbChaineACreer = 0;
	var nbChainesReelementCreees = 0;
	var nbProgrammesDansXml = 0;
	var nbProgrammesParses = 0;
	
	// Download du fichier XML
	request.get('http://webnext.fr/epg_cache/programme-tv-rss_' + dateAujourdhui + '.xml', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			// Recherche des chaines déjà en base
			ProgrammeTvChaine.find(function(err, chainesTvBdd){
				// Enregistrement des chaines présentes en base dans le tableau
				for (var i = 0; i < chainesTvBdd.length; i++)
					chainesTvEnBase.push({"NomChaine" : chainesTvBdd[i].nomChaine, "IdChaine" : chainesTvBdd[i].id});
				
				// Parsing du fichier XML
				parser.parseString(body, function (err, result) {
					if (err)
						sails.log.error("[ProgrammeTV] " + err);
					else
					{	
						var programmes = result.rss.channel[0].item;
						nbProgrammesDansXml = programmes.length;
						
						// Boucle sur l'ensemble des programmes du XML
						async.each(
							programmes,
							function(programme, callback){
								nbProgrammesParses++;
								
								var titleComplet = JSON.stringify(programme.title).replace("[\"", "").replace("\"]", "").split(" | ");
								var category = programme.category;
								var description = programme.description;
								var chaine = nettoieNomChaineTv(titleComplet[0]);
								var heureDebut = titleComplet[1];
								var heureDebutHeure = parseInt(heureDebut.split(":")[0]);
								var heureDebutMinutes = parseInt(heureDebut.split(":")[1]);
								var nomProgramme = titleComplet[2];
								
								// On recherche uniquement les programmes de 20h30 à 21h
								if (heureDebutHeure == 20 && heureDebutMinutes >= 30)
								{
									// Vérification si la chaine existe déjà en base, ou a déjà été trouvée précédemment dans le XML
									if (chainesTvEnBase.getIdChaine(chaine) != -1 || nouvellesChainesSansId.contains(chaine))
									{	
										var estCeLePremierProgrammeTrouvePourCetteChaine = true;
										for (var j = 0; j < programmesParChaine.length; j++)
										{
											if (programmesParChaine[j].nomChaine == chaine)
											{
												estCeLePremierProgrammeTrouvePourCetteChaine = false;
												if (heureDebutMinutes > programmesParChaine[j].heureDebutMinutes)
													programmesParChaine[j] = {
														nomChaine : chaine,
														heureDebutHeure : heureDebutHeure,
														heureDebutMinutes : heureDebutMinutes,
														nomProgramme : nomProgramme,
														typeProgramme : category,
														descriptif : description
													};
												break;
											}
										}
										
										if (estCeLePremierProgrammeTrouvePourCetteChaine)
											programmesParChaine[programmesParChaine.length] = {
												nomChaine : chaine,
												heureDebutHeure : heureDebutHeure,
												heureDebutMinutes : heureDebutMinutes,
												nomProgramme : nomProgramme,
												typeProgramme : category,
												descriptif : description
											};
									}
									else
									{
										sails.log.info("[ProgrammeTV] Nouvelle chaine : " + chaine);
										
										nouvellesChainesSansId.push(chaine);
										programmesParChaine[programmesParChaine.length] = {
											nomChaine : chaine,
											heureDebutHeure : heureDebutHeure,
											heureDebutMinutes : heureDebutMinutes,
											nomProgramme : nomProgramme,
											typeProgramme : category,
											descriptif : description
										};
										nbChaineACreer++;
										
										var chaineACreer = {nomChaine : chaine, ordreAffichage : chainesTvBdd.length + nouvellesChainesSansId.length};
										ProgrammeTvChaine.create(chaineACreer, function(err, chaineACreer){
											if(!err)
											{
												nouvellesChainesAvecId.push({"NomChaine" : chaine, "IdChaine" : chaineACreer.id});
												sails.log.info("[ProgrammeTV] Chaine créée en base : " + chaine);
												if (++nbChainesReelementCreees == nbChaineACreer)
													callback("Traitement terminé");
											}
											else
												sails.log.error("[ProgrammeTV] " + err);
										});
									}
								}
								
								if (nbProgrammesDansXml == nbProgrammesParses && nbChaineACreer == 0)
									callback("Traitement terminé");
							},
							function(err){
								sails.log.info("[ProgrammeTV] Nombre de programmes à créer : " + programmesParChaine.length);
				
								// Suppression des programmes en base avant réimport des nouveaux
								ProgrammeTv.destroy().exec(function(err){
									if(!err)
									{
										// Création des programmes
										for (var i = 0; i < programmesParChaine.length; i++)
										{
											var nomChaine = programmesParChaine[i].nomChaine;
											var IdChaine = chainesTvEnBase.getIdChaine(nomChaine);
											if (IdChaine == -1)
												IdChaine = nouvellesChainesAvecId.getIdChaine(nomChaine);
											
											var programmeACreer = {
												chaine : IdChaine,
												nomProgramme : programmesParChaine[i].nomProgramme,
												heureDebut : programmesParChaine[i].heureDebutHeure + ':' + programmesParChaine[i].heureDebutMinutes,
												typeProgramme : programmesParChaine[i].typeProgramme,
												descriptif : programmesParChaine[i].descriptif
											};
											
											ProgrammeTv.create(programmeACreer, function(err, programmeACreer){
												if(err)
													sails.log.error("[ProgrammeTV] " + err);
												else
													sails.log.info("[ProgrammeTV] Programme créé en base : " + programmeACreer.nomProgramme + " - " + programmeACreer.heureDebut);
											});
										}
									}
									else
										sails.log.error("[ProgrammeTV] " + err);
								});
							}
						);
					}
				});
			});
		}
		else
			sails.log.error(error);
	});
}

/**
 * to convert '1' in '01' (useful to get hour)
 * @method twoDigit
 * @param {} nb
 * @return nb
 */
function twoDigit(nb)
{
	return (nb < 10) ? ('0' + nb) : nb;
}

/**
 * return date in SQL format (ex: 2014-12-27)
 * @method getActualDate
 * @return BinaryExpression
 */
function getActualDate ()
{
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	month = twoDigit(month);
	day = twoDigit(day);
	
	return year + '-' + month + '-' + day;
}

module.exports = {
	
	getProgrammesTvDuJour: function(){
		getProgrammesTv();
	}
};
