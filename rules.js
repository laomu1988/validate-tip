/**
 * @file 校验规则
 */
function required(value, param) {
    if (param && !value && value !== 0 && value !== false) {
        return false;
    }

    return true;
}

module.exports = {
    min: function (val, param) {
        return parseFloat(val) >= parseFloat(param);
    },
    max: function (val, param) {
        return parseFloat(val) <= parseFloat(param);
    },
    required: required,
    require: required,
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
    mobile: /^\d{11}$/,

    // 枚举值
    enum: function (val, param) {
        if (param && param.length > 0) {
            return param.indexOf(val) >= 0;
        }
        return false;
    }
};
