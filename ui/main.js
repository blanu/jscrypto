var activePrivateKey;

function initMain()
{
  loadPrivateKey(activeUser);
  $("#options").tabs();
  $("#sendSubmit").click(send);
  $("#status").hide();
  $("#refreshSubmit").click(refresh);
  refresh();
}

function refresh()
{
  loadMessages(activeUser);
  return false;
}

function loadPrivateKey(username)
{
  $.couch.db(db).view('users/keys', {'key': username, 'success': decryptPrivateKey});
}
 
function decryptPrivateKey(resp)
{
  log('resp: '+resp);
  log(resp.rows[0]);
  var enc=resp.rows[0].value.private;
  log('decrypting: '+enc+' with '+activePassword);
  var privs=AesCtr.decrypt(enc, activePassword, 256);
  log('aes out: '+privs);
  activePrivateKey=JSON.parse(privs);
  log('json out: '+activePrivateKey);
}

function send()
{
  var recipient=$("#recipient").val();
  fetchPublicKey(recipient);
  return false;
}

function fetchPublicKey(recipient)
{
  $.couch.db(db).view('users/keys', {'key': recipient, 'success': sendMessage});
}

function sendMessage(resp)
{
  var recipient=resp.rows[0].key;
  var pub=resp.rows[0].value.public;
  var message=$("#message").val();
  var enc=encrypt(pub, message);
  postMessage(activeUser, recipient, enc);
}

function postMessage(from, to, text)
{
  var msg=new Object();
  msg.type="message";
  msg.from=from;
  msg.to=to
  msg.text=text
  $.couch.db(db).saveDoc(msg);  
  
  $("#status").empty().append("Message sent");
  $("#status").show();
  $("#recipient").val('');
  $("#message").val('');
  setTimeout('$("#status").fadeOut("slow");', 2000);
}

function loadMessages(recipient)
{
  $.couch.db(db).view('messages/forUser', {'key': recipient, 'success': showMessages});  
}

function showMessages(resp)
{
  log('show messages: '+resp.rows.length);
  $("#messages").empty();
  if(resp.rows.length==0)
  {
    $("#messages").append("<li>No messages</li>");
  }
  else
  {
    for(var i=0; i<resp.rows.length; i++)
    {
      var message=resp.rows[i];
      var from=message.value.from;
      var to=message.value.to;
      var enc=message.value.text;
      var text=decrypt(activePrivateKey, enc);
      $("#messages").append("<li>"+"From: "+from+" To: "+to+" Text: "+text+"</li>");
    }
  }
}

initMain();