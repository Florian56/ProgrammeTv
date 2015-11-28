(function () {
  'use strict';
  angular
    .module('app')
    .factory('programmeTvService', programmeTvService);

    programmeTvService.$inject = ['$http'];

    function programmeTvService($http) {
        
		return {
			getProgrammesTv : getProgrammesTv,
			getChainesTv : getChainesTv,
			updateAffichage : updateAffichage,
			ecouterListeProgrammes : ecouterListeProgrammes,
			ecouterDescriptifProgramme : ecouterDescriptifProgramme
		};
        
        function getProgrammesTv(){
             return $http({method: 'GET', url: 'programmetv/indexProgrammes'}).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
        
        function getChainesTv(){
             return $http({method: 'GET', url: 'programmetv/indexChaines'}).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
        
        function updateAffichage(chaine){
             return $http({method: 'POST', url: 'programmetv/updateAffichage', data: chaine}).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
        
        function ecouterListeProgrammes(){
             return $http({method: 'GET', url: 'programmetv/ecouterListeProgrammes'}).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
        
        function ecouterDescriptifProgramme(programme){
             return $http({method: 'POST', url: 'programmetv/ecouterDescriptifProgramme', data: programme}).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
	}
})();