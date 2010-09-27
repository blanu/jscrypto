var db="crypt";
var activeUser;
var activePassword;

function init()
{
  $("#options").tabs();
  $("#loginSubmit").click(login);
  $("#createSubmit").click(create);
  log("init");
}

function log(s)
{
  if(isDefined('console'))
  {
    console.log(s);
  }
}


function isDefined(variable)
{
  return (typeof(window[variable]) == "undefined")?  false: true;
}

function login()
{
  var username=$("#loginUsername").val();
  var password=$("#loginPassword").val();
  var hashed=SHA1(password);
  
  log("username: "+username);
  log("password: "+password);
  
  checkPassword(username, hashed);
  return false;
}

function checkPassword(username)
{
  $.couch.db(db).view('users/passwords', {'key': username, 'success': loginIfPasswordCorrect});
}

function loginIfPasswordCorrect(resp)
{
  var username=$("#loginUsername").val();
  var password=$("#loginPassword").val();
  var hashed=SHA1(password);
    
  log('resp: '+resp.rows.length);
  if(resp.rows.length>0)
  {
    var correct=resp.rows[0].value;
    log('checking password: '+hashed+'/'+correct);
    if(hashed==correct)
    {
      log("correct password");
      loginUser(username, password);
    }
    else
    {
      alert("Wrong password");
    }
  }
  else
  {
    alert("No such user");
  }
}

function loginUser(username, password)
{
  activeUser=username;
  activePassword=password;
  $("#content").load("main.html");
}

function create()
{
  var username=$("#createUsername").val();  
  checkAvailable(username);
  return false;
}

function checkAvailable(username)
{
  $.couch.db(db).view('users/usernames', {'key': username, 'success': createIfAvailable});
}

function createIfAvailable(resp)
{
  log('resp: '+resp.rows.length);
  if(resp.rows.length==0)
  {
    var username=$("#createUsername").val();
    var password=$("#createPassword").val();
    createUser(username, password);
  }
  else
  {
    alert("Username already taken");
  }
}

function createUser(username, password)
{
  var user=new Object();
  user.type="user";
  user.username=username;
  user.password=SHA1(password);
  $.couch.db(db).saveDoc(user);
  
  activeUser=username;
  activePassword=password;
  $("#content").load("keygen.html");
}

$(document).ready(init);