define([
], function(){
    alt.factory('$button', ['$log', function($log){
        return function(type, data){
            type = type || '';
            data = data || {};

            var buttons = {
                'login'             : {
                    'title'         : 'Login',
                    'title_clicked' : 'Logging in...',
                    'description'   : 'Login',
                    'icon'          : '',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'class'         : 'btn btn-primary btn-large btn-block',
                    'type'          : 'submit',
                    'style'         : 'width: 100%;',
                    'disabled'      : false
                },
                'excel'             : {
                    'title'         : 'Excel',
                    'description'   : 'Download Excel',
                    'icon'          : 'icon-cloud-download',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'class'         : 'btn btn-info hidden-xs',
                    'disabled'      : false
                },
                'reset'             : {
                    'title'         : 'Reset',
                    'description'   : 'Reset',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : 'icon-refresh',
                    'class'         : 'btn btn-warning',
                    'disabled'      : false
                },
                'reload'            : {
                    'title'         : 'Reload',
                    'description'   : 'Reload',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : 'icon-rotate-left',
                    'class'         : 'btn btn-primary',
                    'disabled'      : false
                },
                'add'               : {
                    'title'         : 'Tambah',
                    'description'   : 'Tambah',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : 'icon-plus-sign',
                    'class'         : 'btn btn-primary',
                    'disabled'      : false
                },
                'back'              : {
                    'title'         : 'Kembali',
                    'description'   : 'Kembali',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : 'icon-circle-arrow-left',
                    'class'         : 'btn btn-default',
                    'disabled'      : false
                },
                'save'              : {
                    'title'         : 'Simpan',
                    'description'   : 'Simpan',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : 'icon-save',
                    'class'         : 'btn btn-success',
                    'disabled'      : false
                },
                'print'             : {
                    'title'         : 'Print',
                    'description'   : 'Print',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : 'icon-print',
                    'class'         : 'btn btn-default',
                    'disabled'      : false
                },
                'email'             : {
                    'title'         : 'Email',
                    'description'   : 'Email',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : 'icon-envelope',
                    'class'         : 'btn btn-success',
                    'disabled'      : false
                },
                'view'              : {
                    'title'         : 'Lihat',
                    'description'   : 'Lihat',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : 'icon-search',
                    'class'         : 'btn btn-info',
                    'disabled'      : false
                },
                'edit'              : {
                    'title'         : 'Edit',
                    'description'   : 'Edit',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : 'icon-edit',
                    'class'         : 'btn btn-warning',
                    'disabled'      : false
                },
                'remove'            : {
                    'title'         : 'Hapus',
                    'description'   : 'Hapus',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : 'icon-trash',
                    'class'         : 'btn btn-danger',
                    'disabled'      : false
                },
                'yes'               : {
                    'title'         : 'Ya',
                    'description'   : 'Ya',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : 'icon-ok',
                    'class'         : 'btn btn-success',
                    'disabled'      : false
                },
                'no'                : {
                    'title'         : 'Tidak',
                    'description'   : 'Tidak',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : 'icon-remove',
                    'class'         : 'btn btn-danger',
                    'disabled'      : false
                },
                'approve'           : {
                    'title'         : 'Approve',
                    'description'   : 'Approve',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : 'icon-ok',
                    'class'         : 'btn btn-success',
                    'disabled'      : false
                },
                'reject'            : {
                    'title'         : 'Reject',
                    'description'   : 'Reject',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : 'icon-remove',
                    'class'         : 'btn btn-danger',
                    'disabled'      : false
                },
                'search'            : {
                    'title'         : 'Cari',
                    'description'   : 'Cari',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : 'icon-search',
                    'class'         : 'btn btn-default',
                    'disabled'      : false
                },
                'preview'           : {
                    'title'         : 'Preview',
                    'description'   : 'Preview',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : 'icon-file-text-alt',
                    'class'         : 'btn btn-info',
                    'disabled'      : false
                },
                'open'              : {
                    'title'         : 'Buka',
                    'description'   : 'Buka',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : 'icon-folder-open',
                    'class'         : 'btn btn-primary',
                    'disabled'      : false
                },
                'close'             : {
                    'title'         : 'Tutup',
                    'description'   : 'Tutup',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : '',
                    'class'         : 'btn btn-default',
                    'disabled'      : false
                },
                'next'              : {
                    'title'         : 'Berikutnya',
                    'description'   : 'Berikutnya',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : '',
                    'class'         : 'btn btn-success',
                    'disabled'      : false
                },
                'prev'              : {
                    'title'         : 'Sebelumnya',
                    'description'   : 'Sebelumnya',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : '',
                    'class'         : 'btn btn-default',
                    'disabled'      : false
                },
                'start'             : {
                    'title'         : 'Mulai',
                    'description'   : 'Mulai',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : '',
                    'class'         : 'btn btn-primary',
                    'disabled'      : false
                },
                'finish'            : {
                    'title'         : 'Selesai',
                    'description'   : 'Selesai',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : '',
                    'class'         : 'btn btn-primary',
                    'disabled'      : false
                },
                'choose'            : {
                    'title'         : 'Pilih',
                    'description'   : 'Pilih',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : 'icon-check',
                    'class'         : 'btn btn-primary',
                    'disabled'      : false
                },
                'unchoose'            : {
                    'title'         : '',
                    'description'   : '',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : 'icon-check-empty',
                    'class'         : 'btn btn-default',
                    'disabled'      : false
                },
                'up'                : {
                    'title'         : 'Naik',
                    'description'   : 'Naik',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : 'icon-arrow-up',
                    'class'         : 'btn btn-default',
                    'disabled'      : false
                },
                'down'              : {
                    'title'         : 'Turun',
                    'description'   : 'Turun',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : 'icon-arrow-down',
                    'class'         : 'btn btn-default',
                    'disabled'      : false
                },
                'generate'          : {
                    'title'         : 'Generate',
                    'description'   : 'Generate',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : 'icon-cogs',
                    'class'         : 'btn btn-success',
                    'disabled'      : false
                },
                'billing'           : {
                    'title'         : 'Tagihan',
                    'description'   : 'Tagihan',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : 'icon-money',
                    'class'         : 'btn btn-success',
                    'disabled'      : false
                },
                'invoice'           : {
                    'title'         : 'Tagihan',
                    'description'   : 'Tagihan',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : 'icon-money',
                    'class'         : 'btn btn-primary',
                    'disabled'      : false
                },
                'bast'           : {
                    'title'         : 'BAST',
                    'description'   : 'BAST',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : 'icon-file-text',
                    'class'         : 'btn btn-primary',
                    'disabled'      : false
                },
                ''                  : {
                    'title'         : '',
                    'description'   : '',
                    'onclick'       : angular.noop,
                    'href'          : '',
                    'icon'          : '',
                    'style'         : '',
                    'disabled'      : false
                }
            };
            return alt.extend(buttons[type], data);
        };
    }]);

    return alt.component({
        name: 'altButton',
        templateUrl: 'component/alt/button/view.html',
        transclude: true,
        scope: {
            altButton: '=?'
        },
        link: ['$scope', '$log', '$button', '$element', function($scope, $log, $button, $element){
            $scope.altButton = alt.extend({
                'title'         : '',
                'description'   : '',
                'onclick'       : angular.noop,
                'click'         : function(){
                    if($scope.altButton.disabled || $scope.altButton.isclicked || $scope.altButton.href != '') return;

                    var title = $scope.altButton.title;
                    $scope.altButton.isclicked = true;
                    $scope.altButton.title = $scope.altButton.title_clicked || title;

                    var click = $scope.altButton.onclick($scope.altButton);
                    if(typeof click !== 'undefined' && typeof click.then === 'function'){
                        click.then(function(){
                            $scope.altButton.isclicked = false;
                            $scope.altButton.title = title;
                        }, function(){
                            $scope.altButton.isclicked = false;
                            $scope.altButton.title = title;
                        });
                    }else{
                        $scope.altButton.isclicked = false;
                        $scope.altButton.title = title;
                    }
                },
                'href'          : '',
                'href2'         : '',
                'icon'          : '',
                'style'         : '',
                'disabled'      : false,
                'isclicked'     : false
            }, $scope.altButton);

            $scope.$watch('altButton.disabled', function(value){
                if(value && $scope.altButton.href != ''){
                    $scope.altButton.href2 = $scope.altButton.href;
                    $scope.altButton.href = 'javascript:;';
                }else if(!value && $scope.altButton.href2 != '' && $scope.altButton.href != 'javascript:;'){
                    $scope.altButton.href = $scope.altButton.href2;
                    $scope.altButton.href2 = '';
                }
            });

            $element.attr('style', 'display:inline-block;' + $scope.altButton.style);
        }]
    });
});