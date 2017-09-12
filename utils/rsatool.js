/**
 * Created by Brisy on 2017/9/12.
 */
/**
 * Created by Brisy on 2017/9/12.
 */
var NodeRSA = require('node-rsa');
var fs= require('fs');


function rsatool() {}

rsatool.prototype = {

    // 获取公钥
    publicKey: function (callback) {
        fs.readFile('public.key','utf-8',function(err,data){
            if(err){
                callback(err, null);
            }else{
                callback(null, data);
            }
        })
    },
    
    
    // 加密
    encrypt: function (clearText, callback) {
        fs.readFile('public.key','utf-8',function(err,data){
            if(err){
                callback(err, null);
            }else{
                var publicKey = new NodeRSA(data);
                publicKey.setOptions({encryptionScheme: 'pkcs1'});
                var encryptData = publicKey.encrypt(clearText, 'base64');
                callback(null, encryptData);
            }
        })
    },


    // 解密
    decrypt: function (encryptedData, callback) {
        fs.readFile('private.key','utf-8',function(err,data){
            if(err){
                callback(err, null);
            }else{
                var privatekey= new NodeRSA(data);
                privatekey.setOptions({encryptionScheme: 'pkcs1'});
                var decryptedData = privatekey.decrypt(encryptedData, 'utf8');
                callback(null, decryptedData);
            }
        })
    }
}


rsatool.prototype.constructor = rsatool;
module.exports = new rsatool();