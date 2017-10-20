# 检验表单数据是否符合规范并给出提示

## 安装
```
npm install validate-tip
```

## 用法
```
var schema = require('validate-tip');
var user = schema({
    name: {
        name: '用户名',
        type: 'string',
        required: true,
        min_len: 6,
        max_len: 10
    },
    email: {
        name: '邮箱',
        type: 'string',
        required: true,
        email: true
    }
});

var tips = user.validate({name: 'test', email: 'abc'});
if(tips) {
    console.log(tips);
    // tips将提示 ["用户名至少6个字符,当前4个字符","邮箱格式错误"]
}
```
## api
* (schema): 创建校验规则实例
* addRule(ruleName, rule, tip) 自定义验证规则及提示
    - ruleName {string} 校验规则名称
    - rule {regexp|function} 要添加的校验规则
        - 当时正则表达式时，则用其直接校验value， 返回true则表示通过。
        - 当是函数时， 参数为(要校验的属性值，校验规则参数），返回true表示校验通过。
    - tip {string|function} 校验不通过时提示
        - 当时字符串时，将自动替换其中的{value}、{param}或者{name}
        - 当是函数时， 将被传入参数 值value、校验参数param及字段name, 函数需要返回一个字符串
* #schema.validate(data, allField = true) 校验数据
    - data 要校验的数据
    - allField: 是否校验所有属性， 当为false时，只校验data上已存在的属性
* #schema.validateAttr(attrData, attr) 校验某一个属性
    - attrData 要校验的数据
    - attr 校验数据所在属性


### 自定义验证规则rule及提示
```
schema.addRule('enum', function(val, param) {
    if (param && param.length > 0) {
        return param.indexOf(val) >= 0; // 校验通过返回true
    }
    // 校验未通过则返回false
    return false;
}, function(value, param, name) {
    return name + '不是预定值';
})
// tip部分也可以为: '{name}不是预定值'

var test = schema({
    role: {
        name: '用户角色',
        require: true,
        enum: ['admin', 'customer']
    }
});
var err = test.validate({role:'test'});
console.log(err);
// 将输出: ['用户角色不是预定值']
```

## Todo:
- [x] 某一个规则自定义校验规则
- [x] 某一个规则自定义校验提示
- [ ] 数据多个属性有一个出错时就抛出异常，不必校验所有属性
- [ ] 增加异步校验，返回Promise/通过cb
- [ ] 某一个属性单独校验规则
- [ ] 某一个属性单独校验提示

## history:
* 2016.12.14
    - 增加addRule
    - tip增加第四个参数attr
* 2016.12.08
    - 自定义校验规则说明
    - 当没有内容并且不包含require时不校验
* 2016.12.06
    - 初步定义校验规则