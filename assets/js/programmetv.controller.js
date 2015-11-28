(function () {
  'use strict';

  angular
    .module('app')
    .controller('programmeTvCtrl', programmeTvCtrl)
	.filter('descriptifToHtml', ['$sce', function ($sce) {
		return function (text) {
			return $sce.trustAsHtml(text);
		};
	}]);
	
  programmeTvCtrl.$inject = ['programmeTvService', '$scope'];

  function programmeTvCtrl(programmeTvService, $scope){
		/* jshint validthis: true */
		var vm = this;
		
		/* Method */
		vm.updateAffichage = updateAffichage;
		vm.getProgrammesTv = getProgrammesTv;
		vm.plusInfos = plusInfos;
		vm.ecouterDescriptifProgramme = ecouterDescriptifProgramme;
		vm.ecouterListeProgrammes = ecouterListeProgrammes;
		
		/* Template config */
		vm.modal = false;
		//vm.repertoireImage = "/hooks/ProgrammeTv/img"
		vm.repertoireImage = "http://florian.lecraver.free.fr/Test"
		
		/* datas */
		vm.plusInfosDescriptif = "";
		vm.programmeEdit = {};
		vm.programmes = [];
		vm.chaines = [];

		activate();

		function activate() {
			getProgrammesTv();
			getChainesTv();
		}
		
		function getProgrammesTv(){
			vm.modal = false;
			programmeTvService.getProgrammesTv()
				.then(function(data){
					vm.programmes = data.data;
				});
		}
		
		function getChainesTv(){
			programmeTvService.getChainesTv()
				.then(function(data){
					vm.chaines = data.data;
				});
		}
		
		function updateAffichage(chaine){
			return programmeTvService.updateAffichage(chaine);
		}
		
		function plusInfos(programme){
			vm.programmeEdit = programme;
			vm.modal = 'plusInfos';
			vm.plusInfosDescriptif = programme.descriptif;
		}
		
		function ecouterDescriptifProgramme(programme){
			return programmeTvService.ecouterDescriptifProgramme(programme);
		}
		
		function ecouterListeProgrammes(){
			return programmeTvService.ecouterListeProgrammes();
		}
  }
})();