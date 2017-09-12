/**
 * Created by Brisy on 2017/9/12.
 */
'use strict';

var app = require('./app');


var PORT = process.env.PORT || 1370;


app.listen(PORT, "0.0.0.0", function (err) {
    console.log('Node app is running on port:', PORT);

    // 注册全局未捕获异常处理器
    process.on('uncaughtException', function(err) {
        console.error("Caught exception:", err.stack);
    });
    process.on('unhandledRejection', function(reason, p) {
        console.error("Unhandled Rejection at: Promise ", p, " reason: ", reason.stack);
    });
});
