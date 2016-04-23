alt.loader.button = function(){
    if(typeof alt.modules.button !== 'undefined')
        return alt.modules.button;

    // create button service
    alt.buttons = {
        'login': {
            'title': 'Login',
            'title_clicked': 'Logging in...',
            'description': 'Login',
            'icon': '',
            'onclick': angular.noop,
            'href': '',
            'class': 'btn btn-primary btn-large btn-block',
            'type': 'submit',
            'style': 'width: 100%;',
            'disabled': false
        },
        'excel': {
            'title': 'Excel',
            'description': 'Download Excel',
            'icon': 'fa fa-cloud-download',
            'onclick': angular.noop,
            'href': '',
            'class': 'btn btn-info hidden-xs',
            'disabled': false
        },
        'reset': {
            'title': 'Reset',
            'description': 'Reset',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-refresh',
            'class': 'btn btn-warning',
            'disabled': false
        },
        'reload': {
            'title': 'Reload',
            'description': 'Reload',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-rotate-left',
            'class': 'btn btn-primary',
            'disabled': false
        },
        'add': {
            'title': 'Tambah',
            'description': 'Tambah',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-plus-circle',
            'class': 'btn btn-success',
            'disabled': false
        },
        'sub': {
            'title': 'Kurang',
            'description': 'Kurang',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-minus-sign',
            'class': 'btn btn-primary',
            'disabled': false
        },
        'back': {
            'title': 'Kembali',
            'description': 'Kembali',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-arrow-circle-left',
            'class': 'btn btn-warning',
            'disabled': false
        },
        'save': {
            'title': 'Simpan',
            'description': 'Simpan',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-save',
            'class': 'btn btn-success',
            'disabled': false
        },
        'print': {
            'title': 'Print',
            'description': 'Print',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-print',
            'class': 'btn btn-success',
            'disabled': false
        },
        'email': {
            'title': 'Email',
            'description': 'Email',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-envelope',
            'class': 'btn btn-success',
            'disabled': false
        },
        'view': {
            'title': 'Lihat',
            'description': 'Lihat',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-search',
            'class': 'btn btn-info',
            'disabled': false
        },
        'edit': {
            'title': 'Edit',
            'description': 'Edit',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-edit',
            'class': 'btn btn-warning',
            'disabled': false
        },
        'remove': {
            'title': 'Hapus',
            'description': 'Hapus',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-trash',
            'class': 'btn btn-danger',
            'disabled': false
        },
        'yes': {
            'title': 'Ya',
            'description': 'Ya',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-check',
            'class': 'btn btn-success',
            'disabled': false
        },
        'no': {
            'title': 'Tidak',
            'description': 'Tidak',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-remove',
            'class': 'btn btn-danger',
            'disabled': false
        },
        'cancel': {
            'title': 'Batal',
            'description': 'Batal',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-remove',
            'class': 'btn btn-danger',
            'disabled': false
        },
        'verification': {
            'title': 'Verifikasi',
            'description': 'Verifikasi',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-check-square-o',
            'class': 'btn btn-success',
            'disabled': false
        },
        'approve': {
            'title': 'Approve',
            'description': 'Approve',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-check-square-o',
            'class': 'btn btn-success',
            'disabled': false
        },
        'reject': {
            'title': 'Reject',
            'description': 'Reject',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-remove',
            'class': 'btn btn-danger',
            'disabled': false
        },
        'search': {
            'title': 'Cari',
            'description': 'Cari',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-search',
            'class': 'btn btn-default',
            'disabled': false
        },
        'preview': {
            'title': 'Preview',
            'description': 'Preview',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-file-text-alt',
            'class': 'btn btn-info',
            'disabled': false
        },
        'open': {
            'title': 'Buka',
            'description': 'Buka',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-folder-open',
            'class': 'btn btn-primary',
            'disabled': false
        },
        'close': {
            'title': 'Tutup',
            'description': 'Tutup',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-close',
            'class': 'btn btn-danger',
            'disabled': false
        },
        'next': {
            'title': 'Berikutnya',
            'description': 'Berikutnya',
            'onclick': angular.noop,
            'href': '',
            'icon': '',
            'class': 'btn btn-success',
            'disabled': false
        },
        'prev': {
            'title': 'Sebelumnya',
            'description': 'Sebelumnya',
            'onclick': angular.noop,
            'href': '',
            'icon': '',
            'class': 'btn btn-default',
            'disabled': false
        },
        'zoomin': {
            'title': 'Zoom In',
            'description': 'Zoom In',
            'onclick': angular.noop,
            'href': '',
            'icon': '',
            'class': 'btn btn-default',
            'disabled': false
        },
        'zoomout': {
            'title': 'Zoom Out',
            'description': 'Zoom Out',
            'onclick': angular.noop,
            'href': '',
            'icon': '',
            'class': 'btn btn-default',
            'disabled': false
        },
        'start': {
            'title': 'Mulai',
            'description': 'Mulai',
            'onclick': angular.noop,
            'href': '',
            'icon': '',
            'class': 'btn btn-primary',
            'disabled': false
        },
        'finish': {
            'title': 'Selesai',
            'description': 'Selesai',
            'onclick': angular.noop,
            'href': '',
            'icon': '',
            'class': 'btn btn-primary',
            'disabled': false
        },
        'choose': {
            'title': 'Pilih',
            'description': 'Pilih',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-check-square-o',
            'class': 'btn btn-red',
            'disabled': false
        },
        'unchoose': {
            'title': '',
            'description': '',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-square-o',
            'class': 'btn btn-default',
            'disabled': false
        },
        'up': {
            'title': 'Naik',
            'description': 'Naik',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-arrow-up',
            'class': 'btn btn-default',
            'disabled': false
        },
        'down': {
            'title': 'Turun',
            'description': 'Turun',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-arrow-down',
            'class': 'btn btn-default',
            'disabled': false
        },
        'generate': {
            'title': 'Generate',
            'description': 'Generate',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-cogs',
            'class': 'btn btn-success',
            'disabled': false
        },
        'money': {
            'title': '',
            'description': '',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-money',
            'class': 'btn btn-success',
            'disabled': false
        },
        'barcode': {
            'title': 'Barcode',
            'description': 'Barcode',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-barcode',
            'class': 'btn btn-primary',
            'disabled': false
        },
        'qrcode': {
            'title': 'QR code',
            'description': 'QR code',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-qrcode',
            'class': 'btn btn-primary',
            'disabled': false
        },
        'import': {
            'title': 'Import',
            'description': 'Import',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-upload',
            'class': 'btn btn-info',
            'disabled': false
        },
        'export': {
            'title': 'Export',
            'description': 'Export',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-download',
            'class': 'btn btn-info',
            'disabled': false
        },
        'upload': {
            'title': 'Upload',
            'description': 'Upload',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-upload',
            'class': 'btn btn-info',
            'disabled': false
        },
        'download': {
            'title': 'Download',
            'description': 'Download',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-download',
            'class': 'btn btn-info',
            'disabled': false
        },
        'finalize': {
            'title': 'Finalisasi',
            'description': 'Finalisasi',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-ok',
            'class': 'btn btn-success',
            'disabled': false
        },
        'password': {
            'title': 'Password',
            'description': 'Password',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-key',
            'class': 'btn btn-primary',
            'disabled': false
        },
        'map': {
            'title': 'Peta',
            'description': 'Peta',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-map-marker',
            'class': 'btn btn-primary',
            'disabled': false
        },
        'history': {
            'title': 'History',
            'description': 'History',
            'onclick': angular.noop,
            'href': '',
            'icon': 'fa fa-history',
            'class': 'btn btn-primary',
            'disabled': false
        },
        '': {
            'title': '',
            'description': '',
            'onclick': angular.noop,
            'href': '',
            'icon': '',
            'style': '',
            'disabled': false
        }
    };
    alt.modules.button = angular.module('alt-button', [])
        .factory('$button', ['$log', function ($log) {
            return function (type, data) {
                type = type || '';
                data = data || {};

                return alt.extend(alt.buttons[type], data);
            };
        }])
        .run(['$rootScope', '$button', function($rootScope, $button){
            $rootScope.$button = $button;
        }]);

    alt.module('alt-button', alt.modules.button);
};

if(typeof define !== 'undefined') {
    define([], function () {
        alt.loader.button();
    });
}else{
    alt.loader.button();
}