var text='lalala';

//seed('aaaaaaa');
var keys=genkey();
var pub=keys[0];
log('pub: '+JSON.stringify(pub).length);
var priv=keys[1];
var privs=JSON.stringify(priv);
log('priv: '+JSON.stringify(priv).length);
var enc=encrypt(pub, text);
log('ciphertext: '+enc);
var dec=decrypt(priv, enc);
log('plain: '+text+' final: '+dec);

var enc2=AesCtr.encrypt(privs, 'password', 256);
log('aes: '+enc2);
var dec2=AesCtr.decrypt(enc2, 'password', 256);
log('aes out: '+dec2);
