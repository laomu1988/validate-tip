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