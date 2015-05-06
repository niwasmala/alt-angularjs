define([
    'asset/js/ckeditor/ckeditor'
], function(){
    return alt.component({
        name: 'altEditor',
        templateUrl: 'component/alt/editor/view.html',
        scope: {
            editor: '=?altEditor',
            setting: '=?'
        },
        isskip: true,
        link: ['$scope', '$log', '$element', '$alert', '$validate', '$timeout', '$button', '$q', function($scope, $log, $element, $alert, $validate, $timeout, $button, $q){
            $scope.editor = $scope.editor || '';

            $scope.setting      = alt.extend({
                elementid: 'editor' + $scope.$id,
                show: true,
                required: false,
                disabled: false,
                rows: 15,
                'class': "span12",
                style: {},
                data: {},
                editor: null,
                isretrieve: true,
                ckeditor: {
                    language: 'id',
                    toolbar: [
                        { name: 'clipboard', groups: [ 'clipboard', 'undo' ], items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
                        { name: 'editing', groups: [ 'find', 'selection' ], items: [ 'Find', 'Replace', '-', 'SelectAll' ] },
                        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] },
                        { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
                        '/',
                        { name: 'insert', items: [ 'Table', 'HorizontalRule', 'PageBreak' ] },
                        { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
                        { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
                        { name: 'tools', items: [ 'Maximize', 'ShowBlocks', 'Placeholder' ] }
                    ]
                },
                retrieve: function(){
                    $scope.setting.editor = CKEDITOR.replace($scope.setting.elementid, $scope.setting.ckeditor);

                    $scope.setting.editor.on('change', function(event){
                        $scope.editor = event.editor.getData();
                        $scope.$apply();
                    });

                    $scope.$watch('editor', function(newvalue, oldvalue){
                        if($scope.editor != $scope.setting.editor.getData()){
                            $scope.setting.editor.setData($scope.editor);
                        }
                    });
                }
            }, $scope.setting);

            if($scope.setting.isretrieve){
                $timeout($scope.setting.retrieve);
            }
        }]
    });
});