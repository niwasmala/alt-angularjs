// create export service
alt.modules.export = angular.module('alt-export', [])
    .factory('$export', ['$log', function($log){
        return {
            excel: function(html, filename){
                filename = filename || 'download';

                // replacing ngtable filter
                html = html + '';

                var uri         = 'data:application/vnd.ms-excel;base64,',
                    template    = '';

                template       += '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:Name>' + filename + '</x:Name><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>' + filename + '</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>';
                template       += html;
                template       += "</body></html>";

                window.open(uri + window.btoa(template), '_blank');
            },
            print: function(html, css){
                html = html || '';
                css = css || '<link type="text/css" rel="stylesheet" media="all" href="asset/lib/bootstrap2.3.2/bootstrap/css/bootstrap.min.css"/><link type="text/css" rel="stylesheet" media="all" href="asset/css/bootstrap-responsive.min.css"/><link type="text/css" rel="stylesheet" media="all" href="asset/css/style.css"/>';
                var win = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
                win.document.write(css);
                win.document.write(html);
                win.document.close();
                win.focus();
                win.print();
                win.close();
            }
        };
    }]);

alt.module('alt-export', alt.modules.export);