function genkey()
{
  log('genkey');
  var bits=256;

  rsaKeys(bits);
  
  var pubKey=Object();
  var privKey=Object();
  
  privKey.p=rsa_p;
  privKey.q=rsa_q;
  privKey.d=rsa_d;
  privKey.u=rsa_u;
  
  pubKey.n=rsa_pq;
  pubKey.e=rsa_e;
  
  return [pubKey, privKey];
}

function encrypt(pubKey, plaintext)
{
  log("encrypt");
  var p = plaintext+String.fromCharCode(1);
  var b=s2b(p);

  var enc=RSAencrypt(b, pubKey.e, pubKey.n);
  return s2hex(b2s(enc));
}

function decrypt(key, ciphertext)
{
  log("decrypt");
  var enc=s2b(hex2s(ciphertext));
  var dec=b2s(RSAdecrypt(enc, key.d, key.p, key.q, key.u));
  return dec.substr(0, dec.length-1);
}
