/**
 * @file 数据验证
 * - 数据校验时只校验已存在规则
 * - 数据初始化时转化数据类型
 * */
'use strict';
const _ = require('lodash');
const tips = require('./tips');
const rules = require('./rules');

/**
 * 检验一个数据是否符合规则
 * @param {any} value 要校验的数值
 * @param {string} ruleName  匹配的规则
 * @param {any} param 规则所带参数,例如最大包含数目的数字
 * @param {string} name  不匹配时提示的名称
 * @returns {false|string} 匹配规则时返回false,否则返回错误提示内容
 */
function validateOneRules(value, ruleName, param, name, attr) {
    if (rules[ruleName]) {
        var r = rules[ruleName];
        var test = false;
        if (typeof r === 'function') {
            test = r(value, param);
        }
        else if (r instanceof RegExp) {
            test = r.test(value);
        }

        if (!test) {
            var tip = tips[ruleName] || tips.def;
            var type = typeof tip;
            if (type === 'string') {
                var obj = {value: value, param: param, name: name, attr: attr};
                return tip.replace(/\{(\w+)\}/g, function (all, word) {
                    return obj[word];
                });
            }
            else if (type === 'function') {
                return tip(value, param, name, attr);
            }
        }
    }

    return false;
}

function validateRules(value, _rules, attr) {
    var error;
    if (_rules) {
        if (typeof _rules === 'string') {
            _rules = {
                _rules: true
            };
        }

        let required = validateOneRules(value,
            'required',
            _rules.require || _rules.required,
            _rules.name || attr,
            attr);

        if (required) {
            return required;
        }

        for (var ruleName in _rules) {
            if (ruleName === 'require' || ruleName === 'required') {
                continue;
            }

            error = validateOneRules(value, ruleName, _rules[ruleName], _rules.name || attr, attr);
            if (error) {
                return error;
            }

        }
    }

    return false;
}

/**
 * 验证obj是否符合schema规则
 * @param {Object} obj     : 要检查的对象
 * @param {Object} schema  : 检查规则
 * @param {boolean} total   : 是否检查所有属性(为false时将只检查obj上存在的属性)
 */
function validate(obj, schema, total) {
    if (!_.isPlainObject(obj)) {
        throw new Error('validate parameter format error: need plain object!');
    }

    total = typeof total === 'undefined' ? true : total;
    var errors = [];
    for (var attr in schema) {
        if (!total && !obj.hasOwnProperty(attr)) {
            continue;
        }

        let msg = validateRules(obj[attr], schema[attr], attr);
        if (msg) {
            errors.push(msg);
        }

    }
    return errors.length > 0 ? errors : false;
}
function create(schemas, options) {
    'use strict';
    if (options) {
        for (var attr in options) {
            addRule(attr, options[attr].test, options[attr].tip);
        }
    }

    if (!_.isPlainObject(schemas)) {
        throw new Error('schema need plain object.');
    }

    return {
        validate: function (obj, allFields) {
            return validate(obj, schemas, allFields);
        },
        validateAttr: function (value, attr) {
            if (!schemas[attr]) {
                return false;
            }

            return validateRules(value, schemas[attr], attr);
        }
    };
}

create.tips = tips;
create.rules = rules;
create.addRule = function (ruleName, test, tip) {
    if (ruleName && test) {
        rules[ruleName] = test;
        tips[ruleName] = tip;
    }

};

module.exports = create;
