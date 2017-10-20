/**
 * @file 校验提示, 校验未通过时的错误提示
 */

module.exports = {
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
    float: '{name}必须是数字!'
};
