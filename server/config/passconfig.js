/*
passconfig
this module will save the encryption and decryption modules
*/
'use strict'

var crypto 		= 	require('crypto');

module.exports = {
	//This is the key usde for password and token encryption 
//DO NOT MODIFY
	key : 'c0n.3E,!;36Rde|0m0Nos.20.yE.15',

	//this function encrypts the password
	encrypt : function(data,key){
		var cipher = crypto.createCipher('aes256', key);
		var crypted = cipher.update(data, 'utf-8', 'hex');
		crypted += cipher.final('hex');
		return crypted;
	},

	//this function decrypts the password
	decrypt : function(data,key){
		var decipher = crypto.createDecipher('aes256', key);
	    var decrypted = decipher.update(data, 'hex', 'utf-8');
	    decrypted += decipher.final('utf-8');
	    return decrypted;
	}
}