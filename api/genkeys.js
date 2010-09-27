function genkeys(username, password)
{
  //seed('aaaaaaa');
  var keys=genkey();
  var pub=keys[0];
  var pubs=JSON.stringify(pub);
  
  var priv=keys[1];
  var privs=JSON.stringify(priv);
  log('encrypting '+privs+' with '+password);
  var enc=AesCtr.encrypt(privs, password, 256);
  log('publishing private '+enc);
  publishKeys(username, pub, enc);
  
  $("#content").load("main.html");  
}

function publishKeys(username, pub, priv)
{
  var keys=new Object();
  keys.type="keys";
  keys.user=username;
  keys.public=pub
  keys.private=priv
  $.couch.db(db).saveDoc(keys);
}

genkeys(activeUser, activePassword);