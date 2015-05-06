define([
], function(){
    return [
        '$scope', '$routeParams', '$log', '$auth', '$alert',
        function($scope, $routeParams, $log, $auth, $alert){
            $scope.alt = alt;

            $scope.error            = {
                code                : $routeParams.code || '404',
                description         : '',
                description_mini    : ''
            };

            switch($scope.error['code']){
                case '401'  :   // 401 - Unauthorized
                    $scope.error.description      = 'Anda tidak berhak untuk mengakses halaman ini';
                    $scope.error.description_mini = 'Unauthorized';
                    break;
                case '404'  :   // 404 - Page Not Found
                    $scope.error.description      = 'Oops! Halaman yang anda cari tidak ditemukan';
                    $scope.error.description_mini = 'Page Not Found';
                    break;
                case '500'  :   // 500 - Internal Server Error
                    $scope.error.description      = 'Sistem sedang mengalami gangguan, tunggu sebentar';
                    $scope.error.description_mini = 'Internal Server Error';
                    break;
                default     :   // 999 - Unknown Error
                    $scope.error.description      = 'Error sedang dicari tahu, silahkan melihat halaman lain';
                    $scope.error.description_mini = 'Unknown Error';
                    break;
            }
        }];
});