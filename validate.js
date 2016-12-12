/**
 * 数据验证
 * - 数据校验时只校验已存在规则
 * - 数据初始化时转化数据类型
 * */

"use strict";
var _ = require('lodash');


/**
 * 校验未通过时的错误提示
 */
var tips = {
    def: '{name}格式错误', // 默认错误提示
    min: '{name}小于最小值{param}',
    max: '{name}超过最大值{param}',
    required: '{name}不能为空',
    require: '{name}不能为空',
    max_len: function (value, param, name) {
        return name + '最多' + param + '个字符,当前' + (value + '').length + '个字符！';
    },
    min_len: function (value, param, name) {
        return name + '最少' + param + '个字符,当前' + (value + '').length + '个字符！';
    },
    num: '{name}必须是纯数字!',
    int: '{name}必须是纯数字!',
    number: '{name}必须是数字!',
    float: '{name}必须是数字!',
};

/**
 * 校验规则
 */
var rules = {
    // 不去空格
    min: function (val, param) {
        return parseFloat(val) >= parseFloat(param);
    },
    max: function (val, param) {
        return parseFloat(val) <= parseFloat(param);
    },
    required: function (val, param) {
        return !param || (param && hasValue(val));
    },
    require: function (val, param) {
        return !param || (param && hasValue(val));
    },
    max_len: function (val, param) {
        return (val + '').length <= param;
    },
    min_len: function (val, param) {
        return (val + '').length >= param;
    },
    num: /^\s*\d*\s*$/,
    number: /^\s*[\-\+]{0,1}\d*(\.\d*){0,1}\s*$/,
    float: /^\s*[\-\+]{0,1}\d*(\.\d*){0,1}\s*$/,
    password: /^[\w\.\$\d_\@]*$/,
    email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*$/,
    en_text: /^[\w\d_]*$/,
    zh_text: /^[\u4e00-\u9fa5]*$/,
    mobile: /^\d{11}$/
};

function hasValue(value) {
    if (!value && value !== 0 && value !== false) {
        return false;
    }
    return true;
}

/**
 * 检验一个数据是否符合规则
 * @param value 要校验的数值
 * @param rule  匹配的规则
 * @param param 规则所带参数,例如最大包含数目的数字
 * @param name  不匹配时提示的名称
 * @returns {false|string} 匹配规则时返回false,否则返回错误提示内容
 */
function validateOneRules(value, rule, param, name) {
    if (rules[rule]) {
        var r = rules[rule], test = false;
        if (typeof r === 'function') {
            test = r(value, param);
        } else if (r instanceof RegExp) {
            test = r.test(value);
        }
        if (!test) {
            var tip = tips[rule] || tips.def;
            var type = typeof tip;
            if (type === 'string') {
                var obj = {value: value, param: param, name: name};
                return tip.replace(/\{(\w+)\}/g, function (all, word) {
                    return obj[word];
                });
            } else if (type === 'function') {
                return tip(value, param, name);
            }
        }
    }
    return false;
}

function validateRules(value, _rules, attr) {
    var error;
    if (_rules) {
        if (typeof _rules === 'string') {
            _rules = {_rules: true};
        }
        if (!hasValue(value) && !_rules.require && !_rules.required) {
            return false;
        }
        for (var rule in _rules) {
            error = validateOneRules(value, rule, _rules[rule], _rules.name || attr);
            if (error) return error;
        }
    }
    return false;
}
/**
 * 验证obj是否符合schema规则
 * @param obj     : 要检查的对象
 * @param schema  : 检查规则
 * @param total   : 是否检查所有属性(为false时将只检查obj上存在的属性)
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
        errors.push(validateRules(obj[attr], schema[attr], attr));
    }
    errors = _.compact(errors);
    return errors.length > 0 ? errors : false;
}
function create(schemas) {
    "use strict";
    if (!_.isPlainObject(schemas)) {
        throw new Error('schema need plain object.');
    }
    return {
        rules: rules,
        tips: tips,
        validate: function (obj, allFields) {
            return validate(obj, schemas, allFields);
        },
        validateAttr: function (value, attr) {
            if (!schemas[attr]) {
                return false;
            }
            return validateRules(value, schemas[attr], attr);
        }
    }
}

create.tips = tips;
create.rules = rules;

module.exports = create;
