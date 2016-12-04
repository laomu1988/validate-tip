/**
 * 校验schema
 * */
'use strict';
var expect = require('chai').expect;
var schema = require('../validate');

describe('validate', function () {
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

    it('validate-require', function () {
        var obj = {};
        var err = user.validate(obj);
        expect(err[0]).to.contains('用户名不能为空');
        expect(err[1]).to.contains('邮箱不能为空');
    });

    it('validate-email', function () {
        var obj = {name: 'test', email: 'abc'};
        var err = user.validate(obj);
        expect(err[0]).to.contains('最少6个字符');
        expect(err[1]).to.be.equal('邮箱格式错误');
    });

    it('validate-email2', function () {
        var obj = {name: 'test12', email: 'abc@.com'};
        var err = user.validate(obj);
        expect(err[0]).to.be.equal('邮箱格式错误');
    });

    it('validate-email3', function () {
        var obj = {name: 'test12', email: 'abc@123.com'};
        var err = user.validate(obj);
        expect(err).to.be.equal(false);
    });

    it('validateAttr',function(){
        var err = user.validateAttr('test','name');
        expect(err).to.contains('用户名');
    });
});
