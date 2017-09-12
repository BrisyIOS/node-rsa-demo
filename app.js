/**
 * Created by Brisy on 2017/9/12.
 */
/**
 * Created by Brisy on 2017/6/2.
 */
'use strict';
var express = require('express');
var timeout = require('connect-timeout');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var rsatool = require('./utils/rsatool');


var app = express();




// 设置默认超时时间
app.use(timeout('15s'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



//设置跨域访问
app.all('*',function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});


/**
 * 获取公钥
 */
app.post('/publicKey', function (req, res, next) {
    rsatool.publicKey(function (err, result) {
        if (err) {
            res.status(400).json({error: err.message});
        } else if (result) {
            res.json({public_key: result})
        } else {
            next();
        }
    })
});


/**
 * 加密明文
 */
app.post('/encrypt', function (req, res, next) {
    var body = req.body;
    var clearText = body.clearText;
    rsatool.encrypt(clearText, function (err, result) {
        if (err) {
            res.status(400).json({error: err.message});
        } else if (result) {
            res.json(result);
        } else {
            next();
        }
    })
});

/**
 * 解密密文
 */
app.post('/decrypt', function (req, res, next) {
    var body = req.body;
    var encryptedData = body.encryptedData;
    rsatool.decrypt(encryptedData, function (err, result) {
        if (err) {
            res.status(400).json({error: err.message});
        } else if (result) {
            res.json(result);
        } else {
            next();
        }
    })
});


app.use(function(req, res, next) {
    // 如果任何一个路由都没有返回响应，则抛出一个 404 异常给后续的异常处理器
    if (!res.headersSent) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    }
});

// error handlers
app.use(function(err, req, res, next) {
    if (req.timedout && req.headers.upgrade === 'websocket') {
        // 忽略 websocket 的超时
        return;
    }

    var statusCode = err.status || 500;
    if (statusCode === 500) {
        console.error(err.stack || err);
    }
    if (req.timedout) {
        console.error('请求超时: url=%s, timeout=%d, 请确认方法执行耗时很长，或没有正确的 response 回调。', req.originalUrl, err.timeout);
    }
    res.status(statusCode);
    // 默认不输出异常详情
    var error = {}
    if (app.get('env') === 'development') {
        // 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
        error = err;
    }
    res.render('error', {
        message: err.message,
        error: error
    });
});









module.exports = app;