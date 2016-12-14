# 检验表单数据是否符合规范并给出提示

## 安装
```
npm install validate-tip
```

## 用法
```
var schema = require('validate-tip');
var fields = schema({
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

var tips = fields.validate({name: 'test', email: 'abc'});
if(tips) {
    console.log(tips);
    // tips将提示 ["用户名至少6个字符,当前4个字符","邮箱格式错误"]
}
```

### 自定义验证规则
```
schema.rules.enum = function (val, param) {
    if (param && param.length > 0) {
        return param.indexOf(val) >= 0;
    }
    // 校验通过则返回false
    return false;
};
// 校验不通过时的提示
schema.tips.enum = '{name}不是预定值';

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
- 校验规则和提示说明
- 多层校验

## history:
* 2016.12.14
    - tip增加第四个参数attr
* 2016.12.08
    - 自定义校验规则说明
    - 当没有内容并且不包含require时不校验
* 2016.12.06
    - 初步定义校验规则