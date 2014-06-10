/*
* jQuery PwdCheck
* http://carlosrberto.github.com/jquery-pwdcheck/
*
* Copyright (c) 2014 Carlos Roberto Gomes Junior
* http://carlosroberto.name/
*
* Licensed under the MIT License
* http://opensource.org/licenses/MIT
*
* Version: 0.1
*/

(function($) {
    var noop, defaults, pluginName, PwdCheck;

    noop = function() {};

    defaults = {
        validate: noop,
        defaultRules: [
            'hasNumbers',
            'hasLowerCaseLetters',
            'hasUppperCaseLetters',
            'hasSymbols',
            'threeOrMoreChars',
            'sixOrMoreChars',
            'eightOrMoreChars'
        ],
        renderWidget: true
    };

    pluginName = 'pwdcheck';

    PwdCheck = function(el, options) {
        this.el = $(el);
        this.rules = [];
        this.rulesWeight = 0;

        if ( options ) {
            this.settings = $.extend(defaults, options);
        } else {
            this.settings = defaults;
        }

        this._setDefaultRules();
        this._renderWidget();
        this._initEvents();
        this._validate();
    };

    PwdCheck.prototype = {
        _initEvents: function() {
            this.el.on('keyup.'+pluginName, $.proxy(this._validate, this));
        },

        _setDefaultRules: function() {
            this._addRule('hasNumbers', 8, function(value) {
                return (/[0-9]/g).test(value);
            });

            this._addRule('hasLowerCaseLetters', 5, function(value) {
                return (/[a-z]/g).test(value);
            });

            this._addRule('hasUppperCaseLetters', 5, function(value) {
                return (/[A-Z]/g).test(value);
            });

            this._addRule('hasSymbols', 10, function(value) {
                return (/[!"\[\]\$\-+{}%^&*:@~#';/.<>\\|`]/g).test(value);
            });

            this._addRule('threeOrMoreChars', 2, function(value) {
                return value.length >= 3;
            });

            this._addRule('sixOrMoreChars', 4, function(value) {
                return value.length >= 6;
            });

            this._addRule('eightOrMoreChars', 10, function(value) {
                return value.length >= 8;
            });
        },

        _runRules: function() {
            var i = 0, r = this.rules, l = r.length, w = this.rulesWeight, t = 0, v = this.el.val();

            for(; i<l; i++) {
                if (r[i].fn(v) === true) {
                    t+=r[i].weight;
                }
            }
            return Math.round(100*t/w);
        },

        _validate: function() {
            var p = this._runRules();
            this.el.trigger('validate.'+pluginName, [p]);
            this.settings.validate(p);
        },

        _addRule: function(ruleName, weight, fn) {
            if (this.settings.defaultRules.indexOf(ruleName) !== -1) {
                this.rules.push({
                    name: ruleName,
                    weight: weight,
                    fn: typeof fn === 'function' ? fn : noop
                });
                this.rulesWeight += weight;
            }
        },

        _renderWidget: function() {
            if (this.settings.renderWidget) {
                var pwdcheckHTML = ''+
                    '<span class="pwdcheck">'+
                        '<span class="progress">'+
                            '<span class="progress-step"></span>'+
                        '</span>'+
                    '</span>'+
                    '<span class="pwdcheck-label"></span',
                    pwdcheckEl,
                    progressLabel,
                    progressStep;

                this.el.after(pwdcheckHTML);

                pwdcheckEl = this.el.nextAll('.pwdcheck');
                progressStep = pwdcheckEl.find('.progress-step');
                progressLabel = pwdcheckEl.nextAll('.pwdcheck-label');

                this.el.on('validate.pwdcheck', function(event, p) {
                    if (p < 50) {
                        progressLabel.text('FRACA');
                    } else if (p >= 50 && p < 75) {
                        progressLabel.text('MÉDIA');
                    } else if(p >= 75 && p < 90) {
                        progressLabel.text('FORTE');
                    } else if(p >= 90 ) {
                        progressLabel.text('MUITO FORTE');
                    }
                    progressStep.width(p+'%');
                });
            }
        },

        registerRule: function(ruleName, weight, fn) {
            this.rules.push({
                name: ruleName,
                weight: weight,
                fn: typeof fn === 'function' ? fn : noop
            });
            this.rulesWeight += weight;
        },

        destroy: function() {
            this.el.off('.'+pluginName);
            $.removeData(this.el, pluginName);
        }
    };


    $.fn[pluginName] = function( method ) {
        var args = arguments;

        return this.each(function() {

            if ( !$.data(this, pluginName) ) {
                $.data(this, pluginName, new PwdCheck(this, method));
                return;
            }

            var api = $.data(this, pluginName);

            if ( typeof method === 'string' && method.charAt(0) !== '_' && api[ method ] ) {
                api[ method ].apply( api, Array.prototype.slice.call( args, 1 ) );
            } else {
                $.error( 'Method ' +  method + ' does not exist on jQuery.'+pluginName );
            }
        });
    };
})(jQuery);
