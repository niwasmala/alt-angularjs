alt.loader.validation = function(){
    if(typeof alt.modules.validation !== 'undefined')
        return alt.modules.validation;

    // create validate factory
    alt.validate = true;
    alt.validation = {
        required: function (field) {
            if (field !== 0)
                field = (field || '') + '';
            return field !== '' && typeof field !== 'undefined';
        },
        regex: function (field, regex) {
            field = (field || '') + '';
            return regex.test(field);
        },
        email: function (email) {
            return this.regex(email, /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
        },
        username: function (username) {
            username = username + '';
            return username.toLowerCase().replace(/[^a-z0-9._-]/, '');
        },
        number: function (number) {
            return this.regex(number, /^[0-9]+\.?[0-9]*?$/i);
        },
        integer: function (integer) {
            return this.regex(integer, /^[0-9]*$/i);
        },
        equals: function (field1, field2) {
            return field1 === field2;
        },
        notequals: function (field1, field2) {
            return field1 !== field2;
        },
        lessthan: function (left, right) {
            return left < right;
        },
        lessequalthan: function (left, right) {
            return left <= right;
        },
        greaterthan: function (left, right) {
            return left > right;
        },
        greaterequalthan: function (left, right) {
            return left >= right;
        },
        between: function (number, min, max) {
            return min <= number && number <= max;
        },
        date: function (field) {
            field = field + '';
            return field.length == 8 && moment(field, 'YYYYMMDD').isValid();
        },
        month: function (field) {
            field = field + '';
            return field.length == 6 && moment(field, 'YYYYMM').isValid();
        },
        year: function (field) {
            field = field + '';
            return field.length == 4 && moment(field, 'YYYY').isValid();
        },
        time: function (field) {
            field = field + '';
            return field.length == 4 && moment(field, 'HHmm').isValid();
        }
    };
    alt.modules.validation = angular.module('alt-validation', [])
        // create validation service
        .factory('$validate', ['$log', '$injector', function ($log, $injector) {
            var validation = function (validate) {
                validate = typeof validate !== 'undefined' ? validate : (typeof alt.validate !== 'undefined' ? alt.validate : true);

                return {
                    rules: [],
                    messages: [],
                    rule: function (rule, message) {
                        this.rules.push(rule);
                        this.messages.push(message);
                        return this;
                    },
                    validate: function () {
                        var res = true,
                            message = [];

                        for (var i = 0; i < this.rules.length; i++) if (!this.rules[i]) {
                            res = false;
                            message.push(this.messages[i]);
                        }

                        return {
                            res: validate ? res : true,
                            message: message
                        }
                    },
                    check: function () {
                        var validation = this.validate(),
                            $alert = $injector.get('$alert');
                        if (!validation.res) {
                            if ($alert) for (var i = 0; i < validation.message.length; i++) {
                                $alert.add(validation.message[i], $alert.danger);
                            }
                        }
                        return validation.res;
                    }
                };
            };
            for (var i in alt.validation) if (alt.validation.hasOwnProperty(i)) {
                validation[i] = alt.validation[i];
            }
            return validation;
        }]);

    alt.module('alt-validation', alt.modules.route);
};

if(typeof define !== 'undefined') {
    define([], function () {
        alt.loader.validation();
    });
}else{
    alt.loader.validation();
}